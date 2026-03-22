from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Podcast(models.Model):
    STATUS_CHOICES = [
        ('planning', 'Planning'),
        ('planned', 'Planned'),
        ('scripted', 'Scripted'),
        ('synthesizing', 'Synthesizing'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='podcasts')
    title = models.CharField(max_length=255, blank=True)
    topic = models.TextField()
    speaker_count = models.IntegerField(default=2)
    speaker_characteristics = models.JSONField(null=True, blank=True)
    outline = models.JSONField(null=True, blank=True)
    sources = models.JSONField(null=True, blank=True)
    script_content = models.JSONField(null=True, blank=True)
    audio_file = models.FileField(upload_to='podcasts/', null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='planning')
    planning_latency = models.FloatField(null=True, blank=True, help_text="Time taken for planning phase in seconds")
    scripting_latency = models.FloatField(null=True, blank=True, help_text="Time taken for script generation in seconds")
    audio_latency = models.FloatField(null=True, blank=True, help_text="Time taken for audio synthesis in seconds")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title or self.topic[:50]
