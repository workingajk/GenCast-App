import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.models import Podcast

def check_podcast(podcast_id):
    try:
        p = Podcast.objects.get(id=podcast_id)
        print(f"Podcast {p.id}: {p.title}")
        print(f"Status: {p.status}")
        print(f"Script Content Type: {type(p.script_content)}")
        print(f"Script Content: {p.script_content}")
        if p.script_content:
            print(f"Number of lines: {len(p.script_content)}")
        else:
            print("Script content is empty or None")
            
        print(f"Audio File: {p.audio_file.name}")
        if p.audio_file:
            print(f"Audio File Path exists: {os.path.exists(p.audio_file.path)}")
            if os.path.exists(p.audio_file.path):
                print(f"Audio File Size: {os.path.getsize(p.audio_file.path)} bytes")
                
    except Podcast.DoesNotExist:
        print(f"Podcast with id {podcast_id} not found.")

if __name__ == "__main__":
    check_podcast(5)
