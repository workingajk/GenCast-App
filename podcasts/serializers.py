from rest_framework import serializers
from .models import User, Podcast

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']

class PodcastListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing podcasts"""
    class Meta:
        model = Podcast
        fields = ['id', 'title', 'topic', 'status', 'created_at']

class PodcastDetailSerializer(serializers.ModelSerializer):
    """Full detail including outline, sources, script"""
    class Meta:
        model = Podcast
        fields = ['id', 'title', 'topic', 'speaker_count', 'speaker_characteristics', 'outline',
                  'sources', 'script_content', 'audio_file', 'status', 'created_at']
        read_only_fields = ['outline', 'sources', 'script_content', 'audio_file', 'status', 'created_at']

class ScriptUpdateSerializer(serializers.Serializer):
    """For PUT /script endpoint"""
    script_content = serializers.ListField(
        child=serializers.DictField()
    )
