import asyncio
import os
import time
from tabulate import tabulate

from podcasts.tts import synthesize_line_edge

async def generate_tts_matrix(text="This is a test of the emergency broadcast system.", output_dir="evaluations/tts_matrix"):
    """
    Generates a matrix of audio files varying the voice, pitch, and rate
    using Edge TTS.
    """
    
    os.makedirs(output_dir, exist_ok=True)
    print(f"Generating TTS Matrix into '{output_dir}/' ...")
    
    voices = ['en-US-GuyNeural', 'en-US-AriaNeural', 'en-US-AnaNeural']
    pitches = ['-10Hz', '+0Hz', '+10Hz']
    rates = ['-10%', '+0%', '+10%']
    
    matrix_table = []
    
    total_combinations = len(voices) * len(pitches) * len(rates)
    count = 0
    
    for voice in voices:
        for pitch in pitches:
            for rate in rates:
                count += 1
                filename = f"tts_v-{voice}_p-{pitch}_r-{rate}.mp3"
                filename = filename.replace("+", "plus").replace("-", "minus") # sanitize slightly
                filepath = os.path.join(output_dir, filename)
                
                print(f"[{count}/{total_combinations}] Generating {voice} (Pitch: {pitch}, Rate: {rate}) -> {filename}")
                
                start_time = time.time()
                try:
                    # Edge TTS synthesize
                    audio_bytes = await synthesize_line_edge(text, voice, pitch, rate)
                    
                    with open(filepath, 'wb') as f:
                        f.write(audio_bytes)
                        
                    duration = round(time.time() - start_time, 2)
                    status = "Success"
                    
                except Exception as e:
                    print(f"  Error: {e}")
                    status = f"Failed"
                    duration = "N/A"
                    
                matrix_table.append([
                    voice, pitch, rate, status, f"{duration}s", filename
                ])

    print("\n\n### TTS Voice Modulation Matrix\n")
    print(tabulate(matrix_table, headers=["Voice", "Pitch", "Rate", "Status", "Latency", "File"], tablefmt="github"))
    
if __name__ == "__main__":
    asyncio.run(generate_tts_matrix())
