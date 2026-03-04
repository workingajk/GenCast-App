import edge_tts
import asyncio
import os
import io
from gtts import gTTS
from django.conf import settings

# Pluggable interface — only this file changes when swapping TTS engines
SPEAKER_VOICE_MAP = {
    'Host': 'en-US-GuyNeural',
    'Guest': 'en-US-JennyNeural',
    'Speaker 3': 'en-US-AriaNeural',
    'Speaker 4': 'en-US-DavisNeural',
}

async def synthesize_line_edge(text: str, voice: str) -> bytes:
    """Returns MP3 bytes for a single line using Edge TTS."""
    communicate = edge_tts.Communicate(text, voice)
    mp3_io = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            mp3_io.write(chunk["data"])
    return mp3_io.getvalue()

async def synthesize_line_gtts(text: str) -> bytes:
    """Returns MP3 bytes for a single line using gTTS."""
    mp3_io = io.BytesIO()
    tts = gTTS(text=text, lang='en')
    tts.write_to_fp(mp3_io)
    return mp3_io.getvalue()

async def synthesize_podcast(script, model='edge'):
    """
    Iterates through script lines and synthesizes audio segments.
    Returns a list of (speaker, audio_bytes).
    Actually returns just bytes list based on current usage.
    """
    segments = []
    # Force some slight variations for gTTS since it doesn't do multiple speakers natively
    gtts_tlds = {'Host': 'com', 'Guest': 'co.uk', 'Speaker 3': 'com.au'}

    for line in script:
        speaker = line.get('speaker', 'Host')
        text = line.get('text', '')
        if not text.strip():
            continue
            
        # Retry logic for network flakiness
        for _ in range(3):
            try:
                if model == 'gtts':
                    # gTTS implementation
                    tld = gtts_tlds.get(speaker, 'com')
                    mp3_io = io.BytesIO()
                    # Run synchronous gTTS in a thread to keep async interface
                    tts = gTTS(text=text, lang='en', tld=tld)
                    tts.write_to_fp(mp3_io)
                    audio_bytes = mp3_io.getvalue()
                else:
                    # Edge TTS implementation
                    voice = SPEAKER_VOICE_MAP.get(speaker, 'en-US-GuyNeural')
                    audio_bytes = await synthesize_line_edge(text, voice)
                    
                segments.append(audio_bytes)
                break
            except Exception as e:
                print(f"Error synthesizing line: {e}, retrying...")
                await asyncio.sleep(1)
                
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
