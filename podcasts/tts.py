import edge_tts
import asyncio
import os
import io
from gtts import gTTS
import gradio_client
from gradio_client import Client, handle_file
from django.conf import settings

# Pluggable interface — only this file changes when swapping TTS engines
SPEAKER_VOICE_MAP = {
    'Host': 'en-US-GuyNeural',
    'Guest': 'en-US-JennyNeural',
    'Speaker 3': 'en-US-AriaNeural',
    'Speaker 4': 'en-US-DavisNeural',
}

async def synthesize_line_edge(text: str, voice: str, pitch: str = "+0Hz", rate: str = "+0%") -> bytes:
    """Returns MP3 bytes for a single line using Edge TTS."""
    communicate = edge_tts.Communicate(text, voice, pitch=pitch, rate=rate)
    mp3_io = io.BytesIO()
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            mp3_io.write(chunk["data"])
    return mp3_io.getvalue()

async def synthesize_line_gtts(text: str) -> bytes:
    """Returns MP3 bytes for a single line using gTTS."""
    mp3_io = io.BytesIO()
    # Run synchronous gTTS in a thread to keep async interface
    def _run_gtts():
        tts = gTTS(text=text, lang='en')
        tts.write_to_fp(mp3_io)
    await asyncio.to_thread(_run_gtts)
    return mp3_io.getvalue()

def _run_chatterbox(text: str) -> bytes:
    """Synchronous call to Gradio API for Chatterbox."""
    client = Client("resembleai/chatterbox")
    # Using a default audio sample provided by the repository as a reference prompt.
    filepath = client.predict(
        text_input=text,
        audio_prompt_path_input=handle_file("https://github.com/gradio-app/gradio/raw/main/test/test_files/audio_sample.wav"),
        exaggeration_input=0.5,
        temperature_input=0.8,
        seed_num_input=0,
        cfgw_input=0.5,
        vad_trim_input=False,
        api_name="/generate_tts_audio"
    )
    with open(filepath, 'rb') as f:
        audio_bytes = f.read()
    
    # Gradio optionally handles temp paths, we unlink it.
    try:
        os.unlink(filepath)
    except Exception:
        pass
    return audio_bytes

async def synthesize_line_chatterbox(text: str) -> bytes:
    """Returns WAV/MP3 bytes using Resemble AI Chatterbox."""
    return await asyncio.to_thread(_run_chatterbox, text)

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
        voice = line.get('voice', SPEAKER_VOICE_MAP.get(speaker, 'en-US-GuyNeural'))
        pitch = line.get('pitch', '+0Hz')
        rate = line.get('rate', '+0%')
        
        if not text.strip():
            continue
            
        # Retry logic for network flakiness
        for _ in range(3):
            try:
                if model == 'gtts':
                    # gTTS implementation
                    tld = gtts_tlds.get(speaker, 'com')
                    mp3_io = io.BytesIO()
                    def _run_gtts_tld():
                        tts = gTTS(text=text, lang='en', tld=tld)
                        tts.write_to_fp(mp3_io)
                    await asyncio.to_thread(_run_gtts_tld)
                    audio_bytes = mp3_io.getvalue()
                elif model == 'chatterbox':
                    # Resemble AI Chatterbox (via HF Spaces)
                    audio_bytes = await synthesize_line_chatterbox(text)
                else:
                    # Edge TTS implementation
                    print(f"DEBUG TTS -> voice: '{voice}', pitch: '{pitch}', rate: '{rate}'")
                    audio_bytes = await synthesize_line_edge(text, voice, pitch, rate)
                    
                segments.append(audio_bytes)
                break
            except Exception as e:
                print(f"Error synthesizing line (model: {model}, voice: {voice}, pitch: {pitch}, rate: {rate}): {e}, retrying...")
                await asyncio.sleep(1)
                
    return segments

from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from pydub import AudioSegment

def concatenate_and_save(segments, output_filename):
    """
    Concatenates MP3 segments using Pydub and saves them using the default storage.
    """
    if not segments:
        return None

    # Load each bytes segment into a Pydub AudioSegment and concatenate them properly
    combined = AudioSegment.empty()
    for seg_bytes in segments:
        audio_chunk = AudioSegment.from_file(io.BytesIO(seg_bytes), format="mp3")
        combined += audio_chunk
    
    # Export the combined audio to a bytes stream
    out_io = io.BytesIO()
    combined.export(out_io, format="mp3")
    audio_data = out_io.getvalue()
    
    # Path inside the storage (media root)
    filename = f"podcasts/{output_filename}"
    
    # Save the file using Django's storage API
    if default_storage.exists(filename):
        default_storage.delete(filename)
        
    saved_name = default_storage.save(filename, ContentFile(audio_data))
    
    return saved_name
