"""
test_db_rag_context.py

Quick test to verify that the research context is saved to the database
and that the script generation correctly reads from it without using google_search.
"""

import os
import sys
import django
import time

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gencast_backend.settings")
django.setup()

from podcasts.models import Podcast, User
from podcasts.rag_service import generate_plan_rag
from podcasts.views import PodcastGenerateScriptView

# Mocking the request to the view is complex off-server without a client,
# so let's just trigger the functions directly simulating what the views do.

def run_test(topic = "The history of the zipper"):
    
    
    # 1. Get or create a dummy user
    user, _ = User.objects.get_or_create(username="test_rag_user", email="test@test.com")
    
    # 2. Simulate PodcastCreateRagView
    print(f"--- [Phase 1: Planning] ---")
    plan_data = generate_plan_rag(topic, speaker_count=2)
    
    podcast = Podcast.objects.create(
        user=user,
        topic=topic,
        speaker_count=2,
        title=plan_data['outline'].get('title', topic),
        outline=plan_data['outline'],
        sources=plan_data['sources'],
        research_context=plan_data.get('context_text', ''),
        status='planned'
    )
    
    print(f"Created podcast DB record with ID: {podcast.id}")
    print(f"Stored Context Length: {len(podcast.research_context)} characters")
    
    # 3. Simulate PodcastGenerateScriptView
    from podcasts.rag_service import generate_script_rag
    
    print(f"\n--- [Phase 2: Scripting] ---")
    if podcast.research_context:
        print("research_context found in DB! Triggering generate_script_rag (No Web Access)...")
        script = generate_script_rag(
            outline=podcast.outline,
            context_text=podcast.research_context,
            speaker_count=podcast.speaker_count,
            speaker_characteristics=podcast.speaker_characteristics
        )
    else:
        print("ERROR: No research context found!")
        return
        
    podcast.script_content = script
    podcast.status = 'scripted'
    podcast.save()
    
    print(f"\nSuccessfully generated a script with {len(script)} dialogue turns.")
    for line in script[:3]:
        print(f"{line.get('speaker')} [{line.get('voice')}]: {line.get('text')[:60]}...")
    
    # print("\n--- [Cleanup] ---")
    # podcast.delete() 
    # print("Test podcast deleted.")

if __name__ == "__main__":
    run_test("The impact of microplastics on human health")
