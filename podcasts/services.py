from google import genai
from google.genai import types
from django.conf import settings
import json
import re

def get_gemini_client():
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")
    client = genai.Client(api_key=settings.GEMINI_API_KEY)
    return client

def generate_plan(topic, speaker_count=2):
    """
    Generates a podcast plan using Gemini 2.5 Flash with Google Search grounding.
    Returns { outline: {...}, sources: [...] }
    """
    client = get_gemini_client()
    
    # Step 1: Preliminary Search
    search_prompt = f"""
    You are an expert researcher.
    Topic: "{topic}"
    
    Your task is to thoroughly research this topic using Google Search.
    Gather factual, relevant, and up-to-date information, focusing on key points 
    that would make for an engaging {speaker_count}-speaker podcast episode.
    Write a detailed summary of your findings to be used for planning the episode.
    """
    
    search_response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=search_prompt,
        config=types.GenerateContentConfig(
            tools=[{"google_search": {}}]
        )
    )
    
    research_text = search_response.text or ""
    
    # Extract grounding metadata (sources)
    sources = []
    if search_response.candidates:
        grounding = search_response.candidates[0].grounding_metadata
        if grounding and getattr(grounding, 'grounding_chunks', None):
            for chunk in grounding.grounding_chunks:
                if getattr(chunk, 'web', None) and getattr(chunk.web, 'uri', None) and getattr(chunk.web, 'title', None):
                    sources.append({
                        "title": chunk.web.title,
                        "uri": chunk.web.uri
                    })
                
    # Deduplicate sources by URI
    unique_sources = []
    seen_uris = set()
    for s in sources:
        if s['uri'] not in seen_uris:
            unique_sources.append(s)
            seen_uris.add(s['uri'])
            
    # Step 2: Outline Generation
    outline_prompt = f"""
    You are an expert podcast producer. 
    Topic: "{topic}"
    Target format: A structured podcast with {speaker_count} speakers.
    
    Research Material from Preliminary Search:
    {research_text}
    
    Task:
    1. Create a high-level outline for a 5-minute podcast episode based on the Research Material above.
    2. The outline should include a catchy title, a brief summary, and 4-5 key discussion points (subtopics).
    
    OUTPUT FORMAT:
    Return strictly a JSON object with this structure:
    {{
      "title": "Episode Title",
      "summary": "Brief summary...",
      "topics": ["Topic 1", "Topic 2", ...]
    }}
    Do not include any markdown formatting or explanations outside the JSON.
    """
    
    outline_response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=outline_prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    # Extract text and parse JSON
    text = outline_response.text or "{}"
    
    try:
        outline = json.loads(text)
    except json.JSONDecodeError:
        # Fallback: try to find JSON blob
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            outline = json.loads(match.group(1))
        else:
            raise ValueError("Failed to parse Gemini response as JSON")
            
    return {
        "outline": outline,
        "sources": unique_sources
    }

def generate_script(outline, sources, speaker_count=2, speaker_characteristics=None):
    """
    Generates a podcast script using Gemini 2.5 Flash with structured JSON output.
    Returns list of { speaker: "Host", text: "..." }
    """
    client = get_gemini_client()
    
    sources = sources or []
    source_context = "\n".join([f"- {s['title']}: {s['uri']}" for s in sources])
    
    characteristics_context = ""
    if speaker_characteristics and isinstance(speaker_characteristics, list) and len(speaker_characteristics) > 0:
        characteristics_context = "Speaker Characteristics:\n"
        for i, char in enumerate(speaker_characteristics):
            # Assuming labels like Speaker 1, Speaker 2, or generic names
            speaker_label = f"Speaker {i+1}"
            if i == 0: speaker_label = "Host"
            elif i == 1: speaker_label = "Guest"
            characteristics_context += f"- {speaker_label}: {char}\n"
        characteristics_context += "\nIMPORTANT: Ensure the dialogue reflects each speaker's distinct personality, knowledge level, role, and background as defined above. Their tone and style must match these characteristics exactly.\n"
    
    prompt = f"""
    You are a professional scriptwriter.
    
    Podcast Title: {outline.get('title')}
    Summary: {outline.get('summary')}
    Key Topics: {', '.join(outline.get('topics', []))}
    Context/Sources:
    {source_context}
    
    {characteristics_context}
    Task:
    Write a natural, engaging podcast script for {speaker_count} speakers.
    The speakers should be labeled as "Host", "Guest", "Speaker 3", etc.
    The dialogue should flow naturally, be informative, and follow the provided outline.
    Include approximately 10-15 dialogue turns.
    
    Return a valid JSON dictionary with a "script" key containing a list of objects.
    Example:
    {{
        "script": [
            {{ "speaker": "Host", "text": "Welcome to the show!" }},
            {{ "speaker": "Guest", "text": "Thanks for having me." }}
        ]
    }}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash',
        contents=prompt,
        config=types.GenerateContentConfig(
            response_mime_type="application/json"
        )
    )
    
    text = response.text or "{}"
    
    try:
        result = json.loads(text)
        # Handle cases where it might return a list directly or wrapped in "script"
        if isinstance(result, list):
            return result
        return result.get("script", [])
    except json.JSONDecodeError:
        # Fallback: try to find JSON blob
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            result = json.loads(match.group(1))
            if isinstance(result, list):
                return result
            return result.get("script", [])
        else:
            raise ValueError("Failed to parse generated script as JSON")
