import os
import json
import time
from tabulate import tabulate

import django
from django.conf import settings

# Minimal Django settings configuration for testing
if not settings.configured:
    settings.configure(
        GEMINI_API_KEY=os.environ.get('GEMINI_API_KEY', ''),
        MEDIA_ROOT='media'
    )
    django.setup()

from podcasts.services import generate_plan, generate_script, get_gemini_client
from google.genai import types

def run_llm_judge(topic, speaker_char):
    """Generates a script and uses Gemini to evaluate its quality."""
    
    timing = {}
    
    start_plan = time.time()
    try:
        plan = generate_plan(topic, speaker_count=len(speaker_char))
    except Exception as e:
        print(f"Failed to generate plan for '{topic}': {e}")
        return None
    timing['plan_time'] = round(time.time() - start_plan, 2)
    
    start_script = time.time()
    try:
        script = generate_script(plan['outline'], plan['sources'], speaker_count=len(speaker_char), speaker_characteristics=speaker_char)
    except Exception as e:
        print(f"Failed to generate script for '{topic}': {e}")
        return None
    timing['script_time'] = round(time.time() - start_script, 2)
    
    # Run the judge on the generated script
    client = get_gemini_client()
    
    judge_prompt = f"""
    You are an expert podcast critic and JSON validator.
    
    Topic: {topic}
    Outlined Plan: {json.dumps(plan['outline'])}
    Speaker Characteristics: {json.dumps(speaker_char)}
    
    Generated Script to Evaluate:
    {json.dumps(script, indent=2)}
    
    Evaluate the generated script based on these 4 dimensions on a scale of 1-5 (1=Terrible, 5=Perfect).
    - Formatting: Is the script a valid list of objects with the correct keys (speaker, text, voice, pitch, rate)?
    - PersonaAdherence: Does the dialogue match the provided speaker characteristics?
    - VoiceAssignment: Were the voices properly mapped and parameters (pitch/rate) used?
    - CoherenceAndFlow: Does the conversation transition smoothly?
    
    Also, calculate the total number of words in the script and the number of dialogue turns.
    
    Return a strictly valid JSON response like so:
    {{
       "scores": {{
          "Formatting": 5,
          "PersonaAdherence": 4,
          "VoiceAssignment": 5,
          "CoherenceAndFlow": 5
       }},
       "metrics": {{
          "total_words": 1500,
          "dialogue_turns": 15
       }},
       "reasoning": "Brief explanation of the scores."
    }}
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',
            contents=judge_prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json"
            )
        )
        
        evaluation = json.loads(response.text)
        evaluation['timing'] = timing
        evaluation['topic'] = topic
        evaluation['speakers'] = len(speaker_char)
        return evaluation
    except Exception as e:
        print(f"Failed to run LLM judge for '{topic}': {e}")
        return None

def main():
    print("Starting LLM-as-a-Judge Evaluation...")
    
    test_cases = [
        {
            "topic": "The Ethics of Artificial Intelligence",
            "speakers": ["A skeptical philosopher who uses big words", "An optimistic tech CEO who uses buzzwords"]
        },
        {
            "topic": "The mysteries of black holes",
            "speakers": ["A serious astrophysicist", "A curious 10-year-old child who asks simple questions"]
        }
    ]
    
    results = []
    
    for case in test_cases:
        print(f"Running scenario: {case['topic']} ... ", end='', flush=True)
        res = run_llm_judge(case['topic'], case['speakers'])
        if res:
            results.append(res)
            print("Done.")
        else:
            print("Failed.")
    
    if not results:
        print("All evaluations failed. Check API key and internet connectivity.")
        return
        
    print("\n\n--- Evaluation Report ---")
    
    # Prepare tables
    score_table = []
    structure_table = []
    
    for r in results:
        scores = r['scores']
        metrics = r['metrics']
        timing = r['timing']
        
        score_table.append([
             r['topic'],
             scores['Formatting'],
             scores['PersonaAdherence'],
             scores['VoiceAssignment'],
             scores['CoherenceAndFlow'],
             f"{timing['plan_time']}s",
             f"{timing['script_time']}s"
        ])
        
        structure_table.append([
             r['topic'][:20] + '...',
             r['speakers'],
             metrics['dialogue_turns'],
             metrics['total_words']
        ])
    
    print("\n### Judge Scores Matrix\n")
    print(tabulate(score_table, headers=["Topic", "Formatting", "Persona", "Voice", "Flow", "Plan Latency", "Script Latency"], tablefmt="github"))
    
    print("\n### Script Structure Matrix\n")
    print(tabulate(structure_table, headers=["Topic", "Speakers", "Dialogue Turns", "Total Words"], tablefmt="github"))

if __name__ == "__main__":
    main()
