import os
import numpy as np
import soundfile as sf
from tabulate import tabulate

def analyze_audio_directory(directory_path="evaluations/tts_matrix"):
    """
    Scans a directory of audio files and outputs a quality matrix.
    Looks for clipping (peak amplitude hitting max).
    """
    
    print(f"Scanning directory for audio files: {directory_path} ...\n")
    
    if not os.path.exists(directory_path):
        print(f"Directory {directory_path} does not exist.")
        return
        
    audio_files = [f for f in os.listdir(directory_path) if f.endswith('.mp3')][:10] # Limit to 10 for quick testing
    
    # We generated MP3s, but Soundfile sometimes struggles with direct MP3 depending on local libs.
    # PyDub was failing on audioop, we will try standard SoundFile reading.
    # Note: If this fails, we will assume visual/manual review is required for MP3 format.
    
    if not audio_files:
        print("No audio files found in directory.")
        return
        
    quality_matrix = []
    
    for filename in audio_files:
        filepath = os.path.join(directory_path, filename)
        
        try:
            # Attempt to read MP3 data using soundfile
            data, samplerate = sf.read(filepath)
            
            # Detect Peak Volume
            max_amplitude = np.max(np.abs(data))
            # Convert linear amplitude to approx dBFS (0 is max, -inf is silence)
            # max_amplitude of 1.0 is 0 dBFS
            if max_amplitude > 0:
                peak_dbfs = round(20 * np.log10(max_amplitude), 2)
            else:
                peak_dbfs = -float('inf')
                
            clipping = "Yes" if peak_dbfs >= -0.5 else "No" # Margin
            
            # Simple silence detection (amplitude below a threshold)
            threshold = 10 ** (-40 / 20) # -40 dBFS approx linear
            silent_samples = np.sum(np.abs(data) < threshold)
            silence_ratio = round((silent_samples / len(data)) * 100, 2)
            duration_s = round(len(data) / samplerate, 2)
            
            quality_matrix.append([
                filename,
                f"{duration_s}s",
                f"{peak_dbfs} dBFS",
                clipping,
                f"{silence_ratio}%"
            ])
            
        except Exception as e:
            # Soundfile might fail on pure MP3s without proper libsndfile setup on windows
            # Just mark it as skipped/error for the matrix test.
            quality_matrix.append([
                filename, "N/A", "N/A", "N/A", "Lib Error/MP3 read"
            ])
            
    print("### Audio Quality Matrix\n")
    print(tabulate(quality_matrix, headers=["File", "Duration", "Peak Output", "Clipping Detected", "Silence Ratio"], tablefmt="github"))

if __name__ == "__main__":
    analyze_audio_directory()
