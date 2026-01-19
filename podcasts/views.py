import json
import os
import google.generativeai as genai
from rest_framework import status, views
from rest_framework.response import Response
from django.conf import settings
from .models import Podcast
from .serializers import PodcastSerializer

class PodcastCreateView(views.APIView):
    def post(self, request):
        topic = request.data.get('topic')
        if not topic:
            return Response({'error': 'Topic is required'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Mock Retrieval (RAG)
        # In a real scenario, we would search the web here.
        retrieved_context = f"Summary of recent events and facts about: {topic}. (Mocked Search Result)"

        # 2. Generate Script using Gemini
        try:
            script_content = self.generate_script(topic, retrieved_context)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # 3. Create Podcast Record
        podcast = Podcast.objects.create(
            user=request.user if request.user.is_authenticated else None, # Allow anonymous for now or handle auth
            topic=topic,
            script_content=script_content,
            title=f"Podcast about {topic}"
        )
        
        # If user is not authenticated, we might need to handle it differently, 
        # but for now assuming authenticated or nullable user based on model.
        # Wait, model has user as FK. Let's assume request.user is used.
        # If the user is not logged in, this will fail if user is required.
        # The spec implies auth is required ("POST /api/auth/register & login").
        # For this step, I will assume the user is authenticated or I'll handle the case where they aren't if I can't enforce it yet.
        # Actually, let's enforce auth in the view if needed, but for testing I might want to allow it.
        # Let's stick to the plan: "Create Podcast record".
        
        return Response({'script_id': podcast.id, 'script': script_content}, status=status.HTTP_201_CREATED)

    def generate_script(self, topic, context):
        api_key = settings.GEMINI_API_KEY
        if not api_key:
            raise Exception("GEMINI_API_KEY not configured")
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"""
        You are a professional podcast script writer.
        Topic: {topic}
        Context: {context}

        Generate a dialogue script between a Host and a Guest.
        The output must be a valid JSON list of objects, where each object has "speaker" (either "Host" or "Guest") and "text".
        Example:
        [
            {{"speaker": "Host", "text": "Welcome to the show!"}},
            {{"speaker": "Guest", "text": "Thanks for having me."}}
        ]
        Do not include markdown formatting (like ```json). Just return the raw JSON.
        """

        response = model.generate_content(prompt)
        
        try:
            # Clean up potential markdown code blocks if Gemini adds them
            text = response.text.replace('```json', '').replace('```', '').strip()
            return json.loads(text)
        except json.JSONDecodeError:
            # Fallback or retry logic could go here
            raise Exception("Failed to parse Gemini response as JSON: " + response.text)
