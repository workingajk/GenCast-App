import os
import sys
import django
import asyncio

sys.path.append('d:/dev/GenCast')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast.settings')
django.setup()

from podcasts.models import User, Podcast
from podcasts.services import generate_plan, generate_script
from podcasts.tts import synthesize_podcast

async def main():
    print("Testing Podcast Pipeline with Voice/Pitch/Rate")
    print("-" * 50)
    
    topic = "The importance of eating vegetables"
    speaker_characteristics = [
        "A wise, slow-talking 80-year-old grandpa who gives life advice",
        "A highly energetic, fast-talking 7-year-old child who hates broccoli"
    ]
    
    print(f"Topic: {topic}")
    print("Generating Plan...")
    plan_result = generate_plan(topic, speaker_count=2)
    outline = plan_result['outline']
    print(f"Title: {outline['title']}")
    
    print("\nGenerating Script with Voices...")
    script = generate_script(
        outline=outline,
        sources=plan_result['sources'],
        speaker_count=2,
        speaker_characteristics=speaker_characteristics
    )
    
    print("\nGenerated Script JSON snippet:")
    for turn in script[:3]:
        print(f"[{turn.get('speaker')}] Voice: {turn.get('voice')} | Pitch: {turn.get('pitch')} | Rate: {turn.get('rate')}")
        print(f"Text: {turn.get('text')}\n")
        
    print("\nSynthesizing First 2 Lines to Audio (Testing Edge TTS args)...")
    audio_segments = await synthesize_podcast(script[:2], model='edge')
    
    if len(audio_segments) == 2 and audio_segments[0] and audio_segments[1]:
        print("✅ Audio synthesis successful!")
        print(f"Segment 1 size: {len(audio_segments[0])} bytes")
        print(f"Segment 2 size: {len(audio_segments[1])} bytes")
    else:
        print("❌ Audio synthesis failed.")

if __name__ == "__main__":
    asyncio.run(main())
