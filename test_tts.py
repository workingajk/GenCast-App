import asyncio
import edge_tts
import os

async def test_tts():
    text = "Hello, this is a test of the emergency broadcast system."
    voice = "en-US-GuyNeural"
    output = "test_audio.mp3"
    
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output)
    
    if os.path.exists(output):
        size = os.path.getsize(output)
        print(f"Success! Created {output} with size {size} bytes.")
        os.remove(output)
    else:
        print("Failed to create audio file.")

if __name__ == "__main__":
    asyncio.run(test_tts())
