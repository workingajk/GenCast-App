import asyncio
import time
from podcasts.tts import synthesize_podcast

script = [
    {"speaker": "Host", "text": "Welcome to the podcast."},
    {"speaker": "Guest", "text": "Thanks for having me!"},
    {"speaker": "Host", "text": "Today we are discussing performance."},
    {"speaker": "Guest", "text": "Yes, performance is very important."},
]

async def run_baseline():
    start = time.perf_counter()
    res = await synthesize_podcast(script)
    end = time.perf_counter()
    print(f"Time taken: {end - start:.4f} seconds")
    print(f"Segments: {len(res)}")

if __name__ == '__main__':
    asyncio.run(run_baseline())
