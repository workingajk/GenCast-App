from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Podcast(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='podcasts')
    title = models.CharField(max_length=255, blank=True)
    topic = models.TextField()
    script_content = models.JSONField(null=True, blank=True)
    audio_file_url = models.URLField(max_length=500, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or self.topic[:50]
