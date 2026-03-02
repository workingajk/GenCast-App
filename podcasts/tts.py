import edge_tts
import asyncio
import os
import io
from django.conf import settings

# Pluggable interface — only this file changes when swapping TTS engines
SPEAKER_VOICE_MAP = {
    'Host': 'en-US-GuyNeural',
    'Guest': 'en-US-JennyNeural',
    'Speaker 3': 'en-US-AriaNeural',
    'Speaker 4': 'en-US-DavisNeural',
}

async def synthesize_line(text: str, voice: str) -> bytes:
    """Returns MP3 bytes for a single line using Edge TTS."""
    communicate = edge_tts.Communicate(text, voice)
    mp3_io = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            mp3_io.write(chunk["data"])
    return mp3_io.getvalue()

async def _synthesize_single_line_with_retry(text: str, voice: str) -> bytes:
    """Synthesizes a single line with retry logic for network flakiness."""
    for _ in range(3):
        try:
            return await synthesize_line(text, voice)
        except Exception as e:
            print(f"Error synthesizing line: {e}, retrying...")
            await asyncio.sleep(1)
    return b""

async def synthesize_podcast(script):
    """
    Iterates through script lines and synthesizes audio segments concurrently.
    Returns a list of (speaker, audio_bytes).
    Actually returns just bytes list based on current usage.
    """
    tasks = []
    for line in script:
        speaker = line.get('speaker', 'Host')
        text = line.get('text', '')
        if not text.strip():
            continue
            
        voice = SPEAKER_VOICE_MAP.get(speaker, 'en-US-GuyNeural')
        tasks.append(_synthesize_single_line_with_retry(text, voice))
        
    results = await asyncio.gather(*tasks)

    # Filter out empty bytes from retries that failed completely
    segments = [res for res in results if res]
                
    return segments

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

def concatenate_and_save(segments, output_filename):
    """
    Concatenates MP3 segments and saves them using the default storage.
    """
    if not segments:
        return None

    # Join the MP3 chunks into one byte-stream
    audio_data = b"".join(segments)
    
    # Path inside the storage (media root)
    filename = f"podcasts/{output_filename}"
    
    # Save the file using Django's storage API
    if default_storage.exists(filename):
        default_storage.delete(filename)
        
    saved_name = default_storage.save(filename, ContentFile(audio_data))
    
    return saved_name
