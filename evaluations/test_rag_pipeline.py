"""
test_rag_pipeline.py

A simple script to test the Adaptive RAG pipeline (Tavily + Gemini)
without needing to run the full web server.

Usage:
    cd d:\\dev\\GenCast
    .\\venv\\Scripts\\python evaluations\\test_rag_pipeline.py "The future of space tourism"
"""

import os
import sys
import json
import django
from dotenv import load_dotenv

# Setup Django environment
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env variables (TAVILY_API_KEY, GEMINI_API_KEY)
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gencast_backend.settings")
django.setup()

from podcasts.rag_service import generate_plan_rag

def test_rag(topic):
    print(f"--- Starting Adaptive RAG Pipeline Test ---")
    print(f"Topic: {topic}\n")

    try:
        result = generate_plan_rag(topic, speaker_count=2)

        print(f"\n--- RAG Pipeline Results ---")
        print(f"Title:   {result['outline'].get('title')}")
        print(f"Summary: {result['outline'].get('summary')}")
        print(f"Topics:  {', '.join(result['outline'].get('topics', []))}")
        
        print(f"\n--- Sources Found ({len(result['sources'])}) ---")
        for i, s in enumerate(result['sources'][:5], 1):
            print(f"{i}. {s['title']} ({s['uri']})")
        if len(result['sources']) > 5:
            print(f"... and {len(result['sources']) - 5} more.")

        print(f"\n--- Pipeline Performance ---")
        pipeline = result.get('pipeline', {})
        print(f"Initial Snippets:  {pipeline.get('initial_results')}")
        print(f"Gaps Identified:   {pipeline.get('gaps_found')}")
        print(f"Targeted Snippets: {pipeline.get('targeted_results')}")
        print(f"Total Sources:     {pipeline.get('total_sources')}")

    except Exception as e:
        print(f"\n[ERROR] Pipeline failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_topic = sys.argv[1] if len(sys.argv) > 1 else "The impact of microplastics on human health"
    test_rag(test_topic)
