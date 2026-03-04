from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Podcast
from .serializers import (
    PodcastListSerializer, 
    PodcastDetailSerializer, 
    ScriptUpdateSerializer
)
from .services import generate_plan, generate_script
from .tts import synthesize_podcast, concatenate_and_save
from asgiref.sync import async_to_sync

class PodcastCreateView(views.APIView):
    """
    POST /api/podcasts/create/
    Input: { "topic": "str", "speakers": int }
    Action: Generates plan (outline + sources) using Gemini
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic')
        speaker_count = request.data.get('speakers', 2)
        
        if not topic:
            return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # 1. Generate Plan (Gemini + Search)
            plan_data = generate_plan(topic, speaker_count)
            
            # 2. Create Podcast Record
            podcast = Podcast.objects.create(
                user=request.user,
                topic=topic,
                speaker_count=speaker_count,
                title=plan_data['outline'].get('title', topic),
                outline=plan_data['outline'],
                sources=plan_data['sources'],
                status='planned'
            )
            
            serializer = PodcastDetailSerializer(podcast)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PodcastListView(generics.ListAPIView):
    """
    GET /api/podcasts/
    Lists all podcasts for the current user
    """
    serializer_class = PodcastListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Podcast.objects.filter(user=self.request.user).order_by('-created_at')

class PodcastDetailView(generics.RetrieveDestroyAPIView):
    """
    GET /api/podcasts/{id}/
    DELETE /api/podcasts/{id}/
    """
    serializer_class = PodcastDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Podcast.objects.filter(user=self.request.user)

    def perform_destroy(self, instance):
        if instance.audio_file:
            # Delete the file from storage
            instance.audio_file.delete(save=False)
        super().perform_destroy(instance)

class PodcastScriptView(views.APIView):
    """
    GET /api/podcasts/{id}/script/ - Get script
    PUT /api/podcasts/{id}/script/ - Update script manually
    """
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        return get_object_or_404(Podcast, pk=pk, user=self.request.user)

    def get(self, request, pk):
        podcast = self.get_object(pk)
        return Response({"script_content": podcast.script_content})

    def put(self, request, pk):
        podcast = self.get_object(pk)
        serializer = ScriptUpdateSerializer(data=request.data)
        if serializer.is_valid():
            podcast.script_content = serializer.validated_data['script_content']
            podcast.save()
            return Response(serializer.validated_data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PodcastGenerateScriptView(views.APIView):
    """
    POST /api/podcasts/{id}/generate-script/
    Triggers Gemini to write the script based on outline/sources
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        podcast = get_object_or_404(Podcast, pk=pk, user=request.user)
        
        if not podcast.outline:
            return Response({"error": "Podcast has no outline. Create one first."}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            script = generate_script(podcast.outline, podcast.sources, podcast.speaker_count)
            podcast.script_content = script
            podcast.status = 'scripted'
            podcast.save()
            
            return Response({"script_content": script})
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PodcastGenerateAudioView(views.APIView):
    """
    POST /api/podcasts/{id}/generate-audio/
    Triggers Edge TTS to generate audio from script
    """
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        podcast = get_object_or_404(Podcast, pk=pk, user=request.user)
        
        if not podcast.script_content:
            return Response({"error": "Podcast has no script. Generate one first."}, status=status.HTTP_400_BAD_REQUEST)
            
        podcast.status = 'synthesizing'
        podcast.save()
        
        try:
            # Get selected model from request
            model = request.data.get('model', 'edge')

            # Run async TTS code in synchronous view
            # Note: For production, this should be a Celery task
            segments = async_to_sync(synthesize_podcast)(podcast.script_content, model)
            
            import re
            clean_title = re.sub(r'[^\w\s-]', '', podcast.title[:20]).strip().replace(' ', '_')
            filename = f"{podcast.id}_{clean_title}.mp3"
            # Concatenate and save to storage (local or S3)
            saved_name = concatenate_and_save(segments, filename)
            
            # Update podcast record with the saved storage path
            podcast.audio_file.name = saved_name
            podcast.status = 'completed'
            podcast.save()
            
            return Response({
                "audio_url": podcast.audio_file.url,
                "status": "completed"
            })
            
        except Exception as e:
            import traceback; traceback.print_exc()
            podcast.status = 'failed'
            podcast.save()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
