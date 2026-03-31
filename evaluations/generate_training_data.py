"""
generate_training_data.py

Generates RAG-compatible training data for BOTH phases of the GenCast pipeline:
  - Phase 1 (Planning):  topic + RAG text -> outline
  - Phase 2 (Scripting): outline + RAG text -> script

Saves progress to:
  - evaluations/training_data_planning.jsonl
  - evaluations/training_data_scripting.jsonl
  - AND the local SQLite Database (as Podcast objects for the Admin Dashboard)
"""

import os
import sys
import json
import time
import re
import random
import django
from dotenv import load_dotenv

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env"))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "gencast_backend.settings")
django.setup()

from podcasts.models import Podcast
from django.contrib.auth import get_user_model
from podcasts.rag_service import get_tavily_client, initial_retrieval, _format_snippets
from google import genai
from google.genai import types
from django.conf import settings

User = get_user_model()

# ---------------------------------------------------------------------------
# Topic bank
# ---------------------------------------------------------------------------
TOPICS = [
    # Technology
    "The future of quantum computing",
    "How large language models work",
    "The rise of edge computing",
    "Blockchain beyond cryptocurrency",
    "The ethics of AI surveillance",
    "5G and the Internet of Things",
    "Cybersecurity threats in 2025",
    "Open source software and its impact",
    "The metaverse — hype or reality",
    "Autonomous vehicles and safety",
    "Robotics in manufacturing",
    "Digital twins and smart cities",
    "The chip shortage and global supply chains",
    "AR and VR in education",
    "Neural interfaces and brain-computer communication",
    # Science
    "The James Webb Space Telescope discoveries",
    "CRISPR gene editing — promise and peril",
    "The science of sleep and memory",
    "Dark matter and dark energy explained",
    "Nuclear fusion — closer than ever before",
    "Antibiotic resistance and the post-antibiotic era",
    "The microbiome and human health",
    "Climate tipping points we should know about",
    "Psychedelics in psychiatry",
    "The search for extraterrestrial life",
    "Ocean acidification and marine ecosystems",
    "Stem cell therapy breakthroughs",
    "The physics of black holes",
    "Epigenetics and how environment shapes genes",
    "The human brain mapping project",
    # History
    "The fall of the Roman Empire",
    "The Silk Road and ancient trade",
    "The Industrial Revolution and its consequences",
    "The history of the internet",
    "Women's suffrage movements worldwide",
    "The Cold War arms race",
    "The Black Death and its societal impact",
    "Colonialism and its lasting effects",
    "The history of vaccination",
    "Ancient Egyptian civilization",
    "The Renaissance and the birth of modern science",
    "The history of money and banking",
    "The Manhattan Project",
    "The history of democracy",
    "The Space Race — USA vs USSR",
    # Society & Culture
    "Social media and mental health",
    "The gig economy and worker rights",
    "Universal Basic Income — pros and cons",
    "The future of work after automation",
    "Cancel culture and free speech",
    "Immigration policy and global migration trends",
    "The rise of remote work",
    "Income inequality in the 21st century",
    "The opioid crisis in America",
    "Mental health stigma in society",
    "The future of democracy",
    "Misinformation and media literacy",
    "The philosophy of loneliness",
    "Cultural appropriation debates",
    "The science of happiness",
    # Health & Medicine
    "Obesity and public health policy",
    "The future of telemedicine",
    "Medical AI diagnostics",
    "The global aging population",
    "Precision medicine and personalized treatment",
    "The mental health crisis among teenagers",
    "Alternative medicine — evidence vs tradition",
    "Organ transplantation and the donor shortage",
    "The history of pandemics",
    "Long COVID and post-viral syndromes",
    "Nutrition science myths and facts",
    "Exercise and cognitive health",
    "The future of cancer treatment",
    "Healthcare systems compared — USA vs Europe",
    "Drug pricing and pharmaceutical ethics",
    # Environment
    "Renewable energy transition challenges",
    "Plastic pollution solutions",
    "Vertical farming and the future of food",
    "Water scarcity and global conflict",
    "Electric vehicles and the green transition",
    "Deforestation and biodiversity loss",
    "Carbon capture technology",
    "Fast fashion and environmental cost",
    "The circular economy",
    "Rewilding and ecological restoration",
    "Climate change and agriculture",
    "Nuclear power as a green energy source",
    "The Great Barrier Reef and coral bleaching",
    "Sustainable architecture and green buildings",
    "The politics of climate agreements",
    # Business & Economics
    "The rise of startup culture",
    "Central bank digital currencies",
    "The economics of remote work",
    "Supply chain disruption and globalization",
    "The subscription economy",
    "Venture capital and innovation",
    "The future of retail",
    "ESG investing — ethics or strategy",
    "Monopolies in the tech industry",
    "Cryptocurrency regulation",
    "The sharing economy — Uber, Airbnb model",
    "Trade wars and economic nationalism",
    "The economics of attention",
    "Automation and job displacement",
    "The future of banking",
    # Philosophy & Ethics
    "The trolley problem and AI ethics",
    "Free will vs determinism",
    "Philosophy of consciousness",
    "Ethics of genetic engineering",
    "The meaning of life across cultures",
    "Privacy in the digital age",
    "Animal rights and moral consideration",
    "The ethics of eating meat",
    "Philosophy of time",
    "The simulation hypothesis",
]

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
INTER_REQUEST_DELAY    = 2
RATE_LIMIT_WAIT        = 65
MAX_TOPICS_TO_GENERATE = 200  # Generates all remaining topics

VOICE_BANK = [
    {"voice": "en-US-GuyNeural", "persona": "An energetic, fast-talking young man", "pitch_range": (0, 15), "rate_range": (5, 15)},
    {"voice": "en-US-JennyNeural", "persona": "A professional, articulate female news anchor", "pitch_range": (-5, 5), "rate_range": (0, 5)},
    {"voice": "en-US-AriaNeural", "persona": "A warm, slow-speaking calm female host", "pitch_range": (-5, 10), "rate_range": (-10, 0)},
    {"voice": "en-US-RogerNeural", "persona": "A grumpy, gruff older male expert", "pitch_range": (-20, -10), "rate_range": (-15, -5)},
    {"voice": "en-US-JaneNeural", "persona": "A bubbly, high-pitched young female assistant", "pitch_range": (10, 25), "rate_range": (10, 20)},
    {"voice": "en-US-DavisNeural", "persona": "A deep-voiced, authoritative male narrator", "pitch_range": (-15, -5), "rate_range": (-10, 0)},
]

def get_random_speaker_config():
    count = random.randint(1, 4)
    # Pick distinct voices carefully
    chosen_voices = random.sample(VOICE_BANK, count)
    speakers = []
    roles = ["Host", "Guest", "Expert", "Commentator"]
    for i in range(count):
        voice_prof = chosen_voices[i]
        
        # Calculate pitch and rate within the persona's allowed range
        pitch_val = random.randint(voice_prof['pitch_range'][0], voice_prof['pitch_range'][1])
        rate_val = random.randint(voice_prof['rate_range'][0], voice_prof['rate_range'][1])
        
        pitch = f"{pitch_val}Hz"
        rate = f"{rate_val}%"
        
        # Azure requires positive values to explicitly have the + sign
        if not pitch.startswith('-') and pitch != "0Hz": pitch = "+" + pitch
        if not rate.startswith('-') and rate != "0%": rate = "+" + rate
        if pitch == "0Hz": pitch = "+0Hz"
        if rate == "0%": rate = "+0%"
        
        speakers.append({
            "role": roles[i] if i < len(roles) else f"Speaker {i+1}",
            "voice": voice_prof["voice"],
            "persona": voice_prof["persona"],
            "pitch": pitch,
            "rate": rate
        })
    return count, speakers

PLANNING_FILE  = os.path.join(os.path.dirname(__file__), "training_data_planning.jsonl")
SCRIPTING_FILE = os.path.join(os.path.dirname(__file__), "training_data_scripting.jsonl")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_gemini_client():
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")
    return genai.Client(api_key=settings.GEMINI_API_KEY)

def load_done_topics(filepath):
    done = set()
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    done.add(json.loads(line).get("topic", ""))
                except json.JSONDecodeError:
                    pass
    return done

def append_record(filepath, record):
    with open(filepath, "a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")

# ---------------------------------------------------------------------------
# Core Generation Logic (Teacher LLM)
# ---------------------------------------------------------------------------

def generate_training_plan(topic: str, context_text: str, speaker_count: int = 2):
    """Uses Gemini to generate the Ground Truth OUTLINE based exactly on the RAG text."""
    client = get_gemini_client()
    prompt = f"""You are an expert podcast producer. 
Topic: "{topic}"
Target format: A structured podcast with {speaker_count} speakers.

Research Material (retrieved from the web):
{context_text}

Task:
Create a high-level outline for a 5-minute podcast episode based ONLY on the Research Material above.
It must include a catchy title, a brief summary, and 4-5 key discussion points (topics).

OUTPUT FORMAT:
Return strictly a JSON object with this structure:
{{
  "title": "Episode Title",
  "summary": "Brief summary...",
  "topics": ["Topic 1", "Topic 2", ...]
}}
"""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    text = response.text or "{}"
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match: return json.loads(match.group(1))
        return {"title": topic, "summary": "Error generating.", "topics": []}

def generate_training_script(outline: dict, context_text: str, speakers: list):
    """Uses Gemini to generate the Ground Truth SCRIPT based exactly on the Outline and RAG text."""
    client = get_gemini_client()
    
    # Format the speaker instructions
    speaker_instructions = ""
    for sp in speakers:
        speaker_instructions += f"- {sp['role']} (Persona: {sp['persona']} | Voice: {sp['voice']} | Target Pitch: {sp['pitch']} | Target Rate: {sp['rate']})\n"

    prompt = f"""You are a professional scriptwriter.
    
Podcast Title: {outline.get('title')}
Summary: {outline.get('summary')}
Key Topics: {', '.join(outline.get('topics', []))}

Research Material (retrieved from the web):
{context_text}

CRITICAL AUDIO REQUIREMENTS:
You are generating data for a Text-to-Speech (TTS) engine. By default, LLMs incorrectly auto-fill pitch and rate as "+0Hz" and "+0%". YOU MUST NOT DO THIS. 
You MUST extract the EXACT 'Target Pitch' and 'Target Rate' strings from the speaker parameters below and inject them into EVERY single dialogue turn for that speaker.

The speakers and their strictly required parameters are:
{speaker_instructions}

Task:
Write a natural, engaging podcast script for {len(speakers)} speakers heavily grounded in the "Research Material".
Include 10-15 dialogue turns. For each turn, you MUST write the correct speaker's role, and their EXACT Voice, Pitch, and Rate mappings as listed above.

Return a valid JSON dictionary with a "script" key containing a list of objects exactly matching this structure:
{{ "script": [ {{ "speaker": "<Role Name>", "voice": "<Exact Voice>", "pitch": "<EXACT Target Pitch>", "rate": "<EXACT Target Rate>", "text": "..." }} ] }}
"""
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json")
    )
    text = response.text or "{}"
    try:
        data = json.loads(text)
        if isinstance(data, list): return data
        return data.get("script", [])
    except json.JSONDecodeError:
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            data = json.loads(match.group(1))
            return data if isinstance(data, list) else data.get("script", [])
        return []

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    # Ensure there is a user to assign the Podcasts to
    admin_user = User.objects.filter(is_superuser=True).first()
    if not admin_user:
        admin_user = User.objects.first()
        if not admin_user:
            print("Error: No users found in the database. Please run createsuperuser first.")
            return

    planning_done  = load_done_topics(PLANNING_FILE)
    scripting_done = load_done_topics(SCRIPTING_FILE)

    remaining = [t for t in TOPICS if t not in scripting_done]
    print(f"Total topics  : {len(TOPICS)}")
    print(f"Remaining     : {len(remaining)}")
    print(f"Generating max: {MAX_TOPICS_TO_GENERATE} (Safeguard enabled)\n")

    tavily_client = get_tavily_client()
    generated_count = 0

    for i, topic in enumerate(remaining, 1):
        if generated_count >= MAX_TOPICS_TO_GENERATE:
            print(f"\n✅ Reached safeguard limit of {MAX_TOPICS_TO_GENERATE}. Stopping gracefully.")
            break

        print(f"\n[{i}/{len(remaining)}] Topic: '{topic}'")
        
        try:
            # ---------------------------------------------------------
            # PHASE 0: RAG Context Gathering
            # ---------------------------------------------------------
            print("  -> Fetching Web/Jina Context...")
            initial_results, sources = initial_retrieval(topic, tavily_client)
            context_text = _format_snippets(initial_results)
            
            if not context_text or len(context_text) < 100:
                print("  ⚠️ RAG failed or context too short. Skipping.")
                continue

            # ---------------------------------------------------------
            # PHASE 1: Planning (Outline)
            # ---------------------------------------------------------
            # Generate random dynamic speakers for this episode
            speaker_count, speakers_config = get_random_speaker_config()

            if topic not in planning_done:
                print(f"  -> Generating Outline for {speaker_count} speakers...")
                outline = generate_training_plan(topic, context_text, speaker_count)
                
                # NO DUPLICATION: We use clean instruction formatting
                append_record(PLANNING_FILE, {
                    "topic": topic,
                    "instruction": f"Generate a detailed, structured {speaker_count}-speaker podcast outline for the topic.",
                    "input_research": context_text,
                    "output": json.dumps(outline),
                })
                planning_done.add(topic)
                print(f"     ✓ Outline saved.")
                time.sleep(INTER_REQUEST_DELAY)
            else:
                print("  -> Planning already exists. Regenerating to ensure alignment with Script.")
                outline = generate_training_plan(topic, context_text, speaker_count)

            # ---------------------------------------------------------
            # PHASE 2: Scripting
            # ---------------------------------------------------------
            print("  -> Generating Script via Gemini...")
            script = generate_training_script(outline, context_text, speakers_config)
            
            # Create ONLY Persona descriptions without "cheating" and providing mathematical TTS parameters
            speaker_desc_only = ", ".join([f"{s['role']} (Persona: {s['persona']})" for s in speakers_config])
            
            instruction_text = f"Write a {speaker_count}-speaker podcast script using the provided outline and research context.\n\nSpeaker Characteristics:\n{speaker_desc_only}\n\nIMPORTANT: Ensure the dialogue reflects each speaker's distinct personality, knowledge level, role, and background as defined above.\n\nAvailable Voices for Selection:\n- en-US-GuyNeural (Male, Adult)\n- en-US-JennyNeural (Female, Adult)\n- en-US-AriaNeural (Female, Adult)\n- en-US-AnaNeural (Female, Child, young and bright)\n- en-US-ChristopherNeural (Male, Adult)\n- en-US-EricNeural (Male, Adult, deep or older voice)\n- en-US-MichelleNeural (Female, Adult)\n- en-US-RogerNeural (Male, Adult)\n- en-US-SteffanNeural (Male, Adult)\n\nCRITICAL INSTRUCTION FOR VOICE ACTING:\nFor each line of dialogue, you MUST assign an appropriate `voice` ONLY from the \"Available Voices\" list above that best matches the speaker's characteristics. You MUST also optionally specify `pitch` and `rate` to accurately reflect their age and energy level if it deviates from a standard adult. FORMAT RULES FOR PITCH AND RATE:\n- `pitch` MUST be formatted as \"+<number>Hz\" or \"-<number>Hz\". \n- `rate` MUST be formatted as \"+<number>%\" or \"-<number>%\".\n- If no adjustment is needed, default to \"+0Hz\" and \"+0%\"."
            
            # NO DUPLICATION: Explicitly separating the prompt from the variables
            append_record(SCRIPTING_FILE, {
                "topic": topic,
                "instruction": instruction_text,
                "input_outline": outline,
                "input_research": context_text,
                "output": json.dumps(script),
            })
            scripting_done.add(topic)
            print(f"     ✓ Script saved ({len(script)} turns).")

            # ---------------------------------------------------------
            # PHASE 3: Database Persistence for Admin UI
            # ---------------------------------------------------------
            Podcast.objects.create(
                user=admin_user,
                topic=topic,
                title=outline.get("title", topic),
                speaker_count=speaker_count,
                outline=outline,
                sources=sources,
                research_context=context_text,
                script_content={"script": script},
                status='scripted'
            )
            print("     ✓ Database record CREATED. (Check Admin Dashboard!)")
            
            generated_count += 1
            time.sleep(INTER_REQUEST_DELAY)

        except Exception as e:
            if "429" in str(e) or "quota" in str(e).lower():
                print(f"\n⚠️ Rate limit hit. Waiting {RATE_LIMIT_WAIT} seconds...")
                time.sleep(RATE_LIMIT_WAIT)
                remaining.append(topic)
                continue
            print(f"  ❌ Error processing '{topic}': {e}")
            continue

    print(f"\n{'='*50}\nSession complete! Generated {generated_count} new scripts.")

if __name__ == "__main__":
    main()
