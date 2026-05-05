import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.models import Podcast

def generate_latency_table():
    # Only fetch podcasts that have at least one latency value or are completed
    podcasts = Podcast.objects.all().order_by('-created_at')
    
    if not podcasts.exists():
        print("No podcasts found in the database.")
        return

    # Header
    print("| Topic | Planning Latency (s) | Scripting Latency (s) | Audio Latency (s) | Total Latency (s) | Status |")
    print("| :--- | :---: | :---: | :---: | :---: | :---: |")
    
    total_planning = 0
    total_scripting = 0
    total_audio = 0
    total_total = 0
    count = 0
    
    # We only average those that have at least one non-zero latency value
    # to avoid skewing by empty/failed entries
    avg_count = 0
    
    for p in podcasts:
        plan = p.planning_latency or 0
        script = p.scripting_latency or 0
        audio = p.audio_latency or 0
        total = plan + script + audio
        status = p.get_status_display()
        
        # Limit topic length for display
        topic_display = p.topic[:50] + "..." if len(p.topic) > 50 else p.topic
        topic_display = topic_display.replace('\n', ' ').replace('|', '\\|')
        
        print(f"| {topic_display} | {plan:.2f} | {script:.2f} | {audio:.2f} | {total:.2f} | {status} |")
        
        if total > 0 or p.status == 'completed':
            total_planning += plan
            total_scripting += script
            total_audio += audio
            total_total += total
            avg_count += 1
        count += 1
    
    if avg_count > 0:
        avg_planning = total_planning / avg_count
        avg_scripting = total_scripting / avg_count
        avg_audio = total_audio / avg_count
        avg_total = total_total / avg_count
        print(f"| **Average (Active/Completed)** | **{avg_planning:.2f}** | **{avg_scripting:.2f}** | **{avg_audio:.2f}** | **{avg_total:.2f}** | - |")

if __name__ == "__main__":
    generate_latency_table()
