import os
import django
import re

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gencast_backend.settings')
django.setup()

from podcasts.models import Podcast

def count_syllables(word):
    word = word.lower()
    if not word: return 0
    count = 0
    vowels = "aeiouy"
    if word[0] in vowels:
        count += 1
    for index in range(1, len(word)):
        if word[index] in vowels and word[index - 1] not in vowels:
            count += 1
    if word.endswith("e"):
        count -= 1
    if count == 0:
        count += 1
    return count

def calculate_readability(text):
    words = re.findall(r'\w+', text)
    sentences = re.split(r'[.!?]+', text)
    sentences = [s for s in sentences if len(s.strip()) > 0]
    
    if not words or not sentences:
        return 0, 0
    
    num_words = len(words)
    num_sentences = len(sentences)
    num_syllables = sum(count_syllables(w) for w in words)
    
    # Flesch Reading Ease
    # 206.835 - 1.015 * (words/sentences) - 84.6 * (syllables/words)
    score = 206.835 - 1.015 * (num_words / num_sentences) - 84.6 * (num_syllables / num_words)
    
    # Lexical Diversity (Type-Token Ratio)
    unique_words = len(set(w.lower() for w in words))
    diversity = unique_words / num_words if num_words > 0 else 0
    
    return score, diversity

def generate_quality_benchmarks():
    podcasts = Podcast.objects.filter(script_content__isnull=False).order_by('-created_at')
    
    if not podcasts.exists():
        print("No podcasts with scripts found.")
        return

    print("| Topic | Word Count | Readability (Flesch) | Lexical Diversity (TTR) | Quality Level |")
    print("| :--- | :---: | :---: | :---: | :--- |")
    
    total_readability = 0
    total_diversity = 0
    count = 0
    
    for p in podcasts:
        full_text = ""
        if isinstance(p.script_content, list):
            full_text = " ".join([seg.get('text', '') for seg in p.script_content])
        
        if not full_text: continue
        
        readability, diversity = calculate_readability(full_text)
        
        # Quality Label based on Flesch Score
        if readability > 90: label = "Very Easy"
        elif readability > 80: label = "Easy"
        elif readability > 70: label = "Fairly Easy"
        elif readability > 60: label = "Standard"
        elif readability > 50: label = "Fairly Difficult"
        elif readability > 30: label = "Difficult"
        else: label = "Very Confusing"
        
        topic_display = p.topic[:40] + "..." if len(p.topic) > 40 else p.topic
        topic_display = topic_display.replace('\n', ' ').replace('|', '\\|')
        word_count = len(full_text.split())
        
        print(f"| {topic_display} | {word_count} | {readability:.1f} | {diversity:.2%}| {label} |")
        
        total_readability += readability
        total_diversity += diversity
        count += 1

    if count > 0:
        avg_readability = total_readability / count
        avg_diversity = total_diversity / count
        print(f"| **Average** | - | **{avg_readability:.1f}** | **{avg_diversity:.2%}** | - |")

if __name__ == "__main__":
    generate_quality_benchmarks()
