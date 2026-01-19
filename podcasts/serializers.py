from rest_framework import serializers
from .models import User, Podcast

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

class PodcastSerializer(serializers.ModelSerializer):
    class Meta:
        model = Podcast
        fields = ['id', 'user', 'title', 'topic', 'script_content', 'audio_file_url', 'created_at']
        read_only_fields = ['user', 'created_at', 'script_content', 'audio_file_url']
