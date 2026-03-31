from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
import time
from .models import Podcast
from .serializers import (
    PodcastListSerializer, 
    PodcastDetailSerializer, 
    ScriptUpdateSerializer
)
from .services import generate_plan, generate_script
from .rag_service import generate_plan_rag, generate_script_rag
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
        speaker_characteristics = request.data.get('characteristics', [])
        
        if not topic:
            return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # 1. Generate Plan (Gemini + Search)
            start_time = time.time()
            plan_data = generate_plan(topic, speaker_count)
            planning_latency = time.time() - start_time
            
            # 2. Create Podcast Record
            podcast = Podcast.objects.create(
                user=request.user,
                topic=topic,
                speaker_count=speaker_count,
                speaker_characteristics=speaker_characteristics,
                title=plan_data['outline'].get('title', topic),
                outline=plan_data['outline'],
                sources=plan_data['sources'],
                status='planned',
                planning_latency=round(planning_latency, 2)
            )
            
            serializer = PodcastDetailSerializer(podcast)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            import traceback; traceback.print_exc()
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class PodcastCreateRagView(views.APIView):
    """
    POST /api/podcasts/create-rag/
    Same as PodcastCreateView but uses the Adaptive RAG pipeline
    (Tavily retrieval + coverage check) instead of Gemini grounding.
    Stores pipeline metadata for research comparison.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get('topic')
        speaker_count = request.data.get('speakers', 2)
        speaker_characteristics = request.data.get('characteristics', [])

        if not topic:
            return Response({"error": "Topic is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            start_time = time.time()
            plan_data = generate_plan_rag(topic, speaker_count)
            planning_latency = time.time() - start_time

            podcast = Podcast.objects.create(
                user=request.user,
                topic=topic,
                speaker_count=speaker_count,
                speaker_characteristics=speaker_characteristics,
                title=plan_data['outline'].get('title', topic),
                outline=plan_data['outline'],
                sources=plan_data['sources'],
                research_context=plan_data.get('context_text', ''),
                status='planned',
                planning_latency=round(planning_latency, 2)
            )

            serializer = PodcastDetailSerializer(podcast)
            response_data = serializer.data
            # Attach RAG pipeline metadata for research inspection
            response_data['rag_pipeline'] = plan_data.get('pipeline', {})
            return Response(response_data, status=status.HTTP_201_CREATED)

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
            start_time = time.time()
            if podcast.research_context:
                # Use RAG pipeline without Google Search
                script_list = generate_script_rag(
                    outline=podcast.outline, 
                    context_text=podcast.research_context, 
                    speaker_count=podcast.speaker_count, 
                    speaker_characteristics=podcast.speaker_characteristics
                )
                result = {"script": script_list, "new_sources": []}
            else:
                # Use Gemini Grounding pipeline with Google Search
                result = generate_script(podcast.outline, podcast.sources, podcast.speaker_count, podcast.speaker_characteristics)
            
            podcast.scripting_latency = round(time.time() - start_time, 2)
            
            podcast.script_content = result["script"]
            
            # Merge new sources found during script generation (only applies to normal Gemini pipeline)
            existing_sources = podcast.sources or []
            existing_uris = {s.get('uri') for s in existing_sources if s.get('uri')}
            
            for new_s in result.get("new_sources", []):
                if new_s.get('uri') not in existing_uris:
                    existing_sources.append(new_s)
                    existing_uris.add(new_s.get('uri'))
                    
            podcast.sources = existing_sources
            podcast.status = 'scripted'
            podcast.save()
            
            return Response({
                "script_content": podcast.script_content,
                "sources": podcast.sources
            })
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

            start_time = time.time()
            # Run async TTS code in synchronous view
            # Note: For production, this should be a Celery task
            segments = async_to_sync(synthesize_podcast)(podcast.script_content, model)
            
            import re
            clean_title = re.sub(r'[^\w\s-]', '', podcast.title[:20]).strip().replace(' ', '_')
            filename = f"{podcast.id}_{clean_title}.mp3"
            # Concatenate and save to storage (local or S3)
            saved_name = concatenate_and_save(segments, filename)
            podcast.audio_latency = round(time.time() - start_time, 2)
            
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
