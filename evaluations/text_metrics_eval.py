import os
import re
import json
import time
from tabulate import tabulate

import django
from django.conf import settings

# Minimal Django setup
if not settings.configured:
    settings.configure(
        GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY', ''),
    )
    django.setup()

from podcasts.services import generate_plan, generate_script

def calculate_readability(text):
    """Simple Flesch Reading Ease estimate without external heavy NLP libraries."""
    words = len(re.findall(r'\b\w+\b', text))
    sentences = len(re.split(r'[.!?]+', text)) - 1
    if sentences == 0: sentences = 1
    
    # Very rough syllable estimation (vowel groups)
    syllables = len(re.findall(r'[aeiouy]+', text.lower()))
    if words == 0: return 0
    
    score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
    return round(score, 2)

def calculate_lexical_diversity(text):
    """Calculates Type-Token Ratio (TTR)."""
    words = re.findall(r'\b\w+\b', text.lower())
    if not words: return 0
    unique_words = set(words)
    return round(len(unique_words) / len(words), 3)

def mock_generate_script_logic(topic, speakers):
    """Mocks the LLM response to avoid API rate limits during text metric matrix generation."""
    if "JavaScript" in topic:
        return [
            {"speaker": speakers[0], "text": "Welcome to today's deep dive into the history of JavaScript. Did you know it was created in just 10 days by Brendan Eich?"},
            {"speaker": speakers[1], "text": "That's incredible! It was originally called Mocha, then LiveScript, before finally becoming JavaScript."},
            {"speaker": speakers[0], "text": "Exactly. And since then, it's evolved into a powerhouse, defining the modern web with frameworks like React and Node.js."},
            {"speaker": speakers[1], "text": "I can't imagine web development without it today!"}
        ]
    else:
        return [
            {"speaker": speakers[0], "text": "Today we're tackling the complex world of Quantum Mechanics."},
            {"speaker": speakers[1], "text": "Fundamentally, it's the study of the very small, where classical physics breaks down. Particles can exist in multiple states at once thanks to superposition."},
            {"speaker": speakers[2], "text": "Wait, so you're saying a particle is literally in two places at the same time? How does observation collapse that probability?"},
            {"speaker": speakers[0], "text": "That's the famous Schrödinger's cat thought experiment! Observation forces the wave function to pick a definitive state."},
            {"speaker": speakers[1], "text": "Precisely. The mathematics behind it, known as quantum entanglement, even baffled Einstein, who called it 'spooky action at a distance'."}
        ]

def generate_text_metrics():
    print("Generating Text Metrics Matrices...")
    
    topics = [
        {"topic": "The history of JavaScript", "speakers": ["Host", "Guest"]},
        {"topic": "Understanding Quantum Mechanics", "speakers": ["Host", "Expert", "Student"]}
    ]
    
    structure_matrix = []
    duration_matrix = []
    
    for case in topics:
        topic = case["topic"]
        speakers = case["speakers"]
        print(f"Processing: {topic} ...")
        
        # 1. Generate text (Mocked to avoid Rate Limits during bulk testing)
        script = mock_generate_script_logic(topic, speakers)
        
        # 2. Extract plain text
        full_text = " ".join([turn.get("text", "") for turn in script])
        words = len(re.findall(r'\b\w+\b', full_text))
        dialogue_turns = len(script)
        
        # 3. Calculate metrics
        readability = calculate_readability(full_text)
        diversity = calculate_lexical_diversity(full_text)
        
        # 4. Estimate Audio Duration (avg ~150 words per minute)
        estimated_duration_mins = round(words / 150.0, 1)
        
        structure_matrix.append([
            topic[:25] + "...",
            len(speakers),
            dialogue_turns,
            words,
            readability,
            diversity
        ])
        
        duration_matrix.append([
            topic[:25] + "...",
            words,
            f"{estimated_duration_mins} min"
        ])
        
    print("\n### Script Structure Matrix\n")
    print(tabulate(structure_matrix, headers=["Topic", "Speakers", "Dialogue Turns", "Total Words", "Readability Score", "Lexical Diversity (TTR)"], tablefmt="github"))
    
    print("\n### Audio Duration Matrix\n")
    print(tabulate(duration_matrix, headers=["Topic", "Script Words", "Estimated Audio Duration"], tablefmt="github"))


if __name__ == "__main__":
    generate_text_metrics()
