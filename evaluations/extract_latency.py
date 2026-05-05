import os
import sys
import django
from django.conf import settings
from django.db.models import Avg

# Setup Django environment
sys.path.insert(0, os.getcwd())
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gencast_backend.settings")
django.setup()

from podcasts.models import Podcast

def extract_metrics():
    print("### Extracting Latency Metrics from Database (Main Branch - Gemini API Pipeline) ###\n")
    print("Note: Filtering out entries with Planning Latency > 50s (likely local models).\n")
    
    # Filter for completed podcasts and ignore local model runs
    queryset = Podcast.objects.filter(status='completed', planning_latency__lte=50)
    
    count = queryset.count()
    if count == 0:
        print("No completed podcasts found in the database.")
        return

    averages = queryset.aggregate(
        avg_planning=Avg('planning_latency'),
        avg_scripting=Avg('scripting_latency'),
        avg_audio=Avg('audio_latency')
    )
    
    table_data = [
        ["Phase", "Average Latency (seconds)"],
        ["Planning (Gemini + Grounding)", round(averages['avg_planning'], 2) if averages['avg_planning'] else "N/A"],
        ["Script Generation (Gemini)", round(averages['avg_scripting'], 2) if averages['avg_scripting'] else "N/A"],
        ["Audio Generation (Edge TTS)", round(averages['avg_audio'], 2) if averages['avg_audio'] else "N/A"],
        ["Total Duration", round((averages['avg_planning'] or 0) + (averages['avg_scripting'] or 0) + (averages['avg_audio'] or 0), 2)],
    ]

    print(f"Metrics based on {count} completed podcasts:\n")
    from tabulate import tabulate
    print(tabulate(table_data, headers="firstrow", tablefmt="github"))
    
    print("\n### Per-Podcast Detail (Last 5) ###\n")
    detail_data = []
    for p in queryset.order_by('-created_at')[:5]:
        detail_data.append([
            p.title or p.topic[:20],
            round(p.planning_latency, 2) if p.planning_latency else "N/A",
            round(p.scripting_latency, 2) if p.scripting_latency else "N/A",
            round(p.audio_latency, 2) if p.audio_latency else "N/A",
            round((p.planning_latency or 0) + (p.scripting_latency or 0) + (p.audio_latency or 0), 2)
        ])
    
    print(tabulate(detail_data, headers=["Title/Topic", "Planning", "Scripting", "Audio", "Total"], tablefmt="github"))

if __name__ == "__main__":
    extract_metrics()
