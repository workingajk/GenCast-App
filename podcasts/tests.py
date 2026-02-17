from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import User, Podcast
from unittest.mock import patch, MagicMock

class BackendTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword123'
        }
        self.user = User.objects.create_user(**self.user_data)
        # Obtain JWT token
        response = self.client.post('/api/auth/login/', {
            'username': 'testuser',
            'password': 'testpassword123'
        })
        self.token = response.data['access']
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')

    def test_auth_registration(self):
        data = {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpassword123'
        }
        response = self.client.post('/api/auth/register/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)

    @patch('podcasts.views.generate_plan')
    def test_create_podcast_plan(self, mock_plan):
        # Mock Gemini response
        mock_plan.return_value = {
            'outline': {
                'title': 'Test Podcast',
                'summary': 'A test summary',
                'topics': ['Topic 1', 'Topic 2']
            },
            'sources': [{'title': 'Source 1', 'uri': 'http://example.com'}]
        }
        
        data = {'topic': 'Test Topic', 'speakers': 2}
        response = self.client.post('/api/podcasts/create/', data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Podcast.objects.count(), 1)
        podcast = Podcast.objects.first()
        self.assertEqual(podcast.topic, 'Test Topic')
        self.assertEqual(podcast.status, 'planned')
        self.assertEqual(podcast.outline['title'], 'Test Podcast')

    def test_list_podcasts(self):
        Podcast.objects.create(user=self.user, topic="Topic 1", title="Title 1")
        Podcast.objects.create(user=self.user, topic="Topic 2", title="Title 2")
        
        response = self.client.get('/api/podcasts/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_update_script(self):
        podcast = Podcast.objects.create(
            user=self.user, 
            topic="Test", 
            script_content=[{"speaker": "Host", "text": "Old text"}]
        )
        url = f'/api/podcasts/{podcast.id}/script/'
        new_script = [{"speaker": "Host", "text": "New text"}]
        
        response = self.client.put(url, {'script_content': new_script}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        podcast.refresh_from_db()
        self.assertEqual(podcast.script_content, new_script)

    @patch('podcasts.views.generate_script')
    def test_generate_script(self, mock_gen):
        mock_gen.return_value = [{"speaker": "Host", "text": "Generated"}]
        podcast = Podcast.objects.create(
            user=self.user, 
            topic="Test", 
            outline={"title": "T"}, 
            sources=[]
        )
        
        url = f'/api/podcasts/{podcast.id}/generate-script/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['script_content'][0]['text'], "Generated")
        
        podcast.refresh_from_db()
        self.assertEqual(podcast.status, 'scripted')

    @patch('podcasts.views.synthesize_podcast')
    @patch('podcasts.views.concatenate_and_save')
    def test_generate_audio(self, mock_save, mock_synth):
        # Mock async to sync wrapper and file saving
        mock_synth.return_value = [b'fake_audio']
        mock_save.return_value = 'podcasts/test_audio.mp3'
        
        podcast = Podcast.objects.create(
            user=self.user, 
            topic="Test", 
            script_content=[{"speaker": "Host", "text": "Hi"}]
        )
        
        url = f'/api/podcasts/{podcast.id}/generate-audio/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')
        
        podcast.refresh_from_db()
        self.assertEqual(podcast.status, 'completed')
        self.assertTrue(podcast.audio_file.name.endswith('.mp3'))
