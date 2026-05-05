import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.models import Podcast

def generate_detailed_benchmarks():
    podcasts = Podcast.objects.all().order_by('-created_at')
    
    if not podcasts.exists():
        print("No podcasts found in the database.")
        return

    # Header
    print("| Topic | Word Count | Segments | Script Latency (s) | Audio Latency (s) | Script WPM | Audio WPS | Total (s) |")
    print("| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |")
    
    # Totals for averaging
    metrics = {
        'words': 0,
        'segments': 0,
        'script_lat': 0,
        'audio_lat': 0,
        'total_lat': 0,
        'script_wps': 0,
        'audio_wps': 0,
    }
    avg_count = 0
    
    for p in podcasts:
        # Calculate word and segment count
        word_count = 0
        segment_count = 0
        if p.script_content and isinstance(p.script_content, list):
            segment_count = len(p.script_content)
            for segment in p.script_content:
                text = segment.get('text', '')
                word_count += len(text.split())
        
        script_lat = p.scripting_latency or 0
        audio_lat = p.audio_latency or 0
        plan_lat = p.planning_latency or 0
        total_lat = script_lat + audio_lat + plan_lat
        
        # Calculate rates (avoid division by zero)
        script_wps = word_count / script_lat if script_lat > 0 else 0
        script_wpm = script_wps * 60  # Words Per Minute for scripting
        audio_wps = word_count / audio_lat if audio_lat > 0 else 0
        
        # Topic formatting
        topic_display = p.topic[:40] + "..." if len(p.topic) > 40 else p.topic
        topic_display = topic_display.replace('\n', ' ').replace('|', '\\|')
        
        print(f"| {topic_display} | {word_count} | {segment_count} | {script_lat:.2f} | {audio_lat:.2f} | {script_wpm:.1f} | {audio_wps:.2f} | {total_lat:.2f} |")
        
        if word_count > 0 and (script_lat > 0 or audio_lat > 0):
            metrics['words'] += word_count
            metrics['segments'] += segment_count
            metrics['script_lat'] += script_lat
            metrics['audio_lat'] += audio_lat
            metrics['total_lat'] += total_lat
            metrics['script_wps'] += script_wps
            metrics['audio_wps'] += audio_wps
            avg_count += 1

    if avg_count > 0:
        avg_words = metrics['words'] / avg_count
        avg_segments = metrics['segments'] / avg_count
        avg_script_lat = metrics['script_lat'] / avg_count
        avg_audio_lat = metrics['audio_lat'] / avg_count
        avg_total_lat = metrics['total_lat'] / avg_count
        avg_script_wpm = (metrics['script_wps'] / avg_count) * 60
        avg_audio_wps = metrics['audio_wps'] / avg_count
        
        print(f"| **Average** | **{avg_words:.0f}** | **{avg_segments:.1f}** | **{avg_script_lat:.2f}** | **{avg_audio_lat:.2f}** | **{avg_script_wpm:.1f}** | **{avg_audio_wps:.2f}** | **{avg_total_lat:.2f}** |")

if __name__ == "__main__":
    generate_detailed_benchmarks()
