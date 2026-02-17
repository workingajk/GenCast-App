import google.generativeai as genai
from django.conf import settings
import json
import re

def get_gemini_client():
    if not settings.GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")
    genai.configure(api_key=settings.GEMINI_API_KEY)
    return genai

def generate_plan(topic, speaker_count=2):
    """
    Generates a podcast plan using Gemini 2.5 Flash with Google Search grounding.
    Returns { outline: {...}, sources: [...] }
    """
    client = get_gemini_client()
    model = client.GenerativeModel('gemini-2.5-flash')
    
    prompt = f"""
    You are an expert podcast producer. 
    Topic: "{topic}"
    Target format: A structured podcast with {speaker_count} speakers.
    
    Task:
    1. Research the topic using Google Search to find relevant, factual, and up-to-date information.
    2. Create a high-level outline for a 5-minute podcast episode.
    3. The outline should include a catchy title, a brief summary, and 4-5 key discussion points (subtopics).
    
    OUTPUT FORMAT:
    Return strictly a JSON object with this structure:
    {{
      "title": "Episode Title",
      "summary": "Brief summary...",
      "topics": ["Topic 1", "Topic 2", ...]
    }}
    Do not include any markdown formatting or explanations outside the JSON.
    """
    
    # Updated tool configuration for google-generativeai >= 0.8.5
    tool = genai.protos.Tool(google_search={})
    response = model.generate_content(
        prompt,
        tools=[tool]
    )
    
    # Extract text and parse JSON
    text = response.text or "{}"
    text = text.replace("```json", "").replace("```", "").strip()
    
    try:
        outline = json.loads(text)
    except json.JSONDecodeError:
        # Fallback: try to find JSON blob
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        if match:
            outline = json.loads(match.group(1))
        else:
            raise ValueError("Failed to parse Gemini response as JSON")
            
    # Extract grounding metadata (sources)
    sources = []
    if response.candidates and response.candidates[0].grounding_metadata:
        for chunk in response.candidates[0].grounding_metadata.grounding_chunks:
            if chunk.web and chunk.web.uri and chunk.web.title:
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
            
    return {
        "outline": outline,
        "sources": unique_sources
    }

def generate_script(outline, sources, speaker_count=2):
    """
    Generates a podcast script using Gemini 2.5 Flash with structured JSON output.
    Returns list of { speaker: "Host", text: "..." }
    """
    client = get_gemini_client()
    model = client.GenerativeModel('gemini-2.5-flash')
    
    sources = sources or []
    source_context = "\n".join([f"- {s['title']}: {s['uri']}" for s in sources])
    
    prompt = f"""
    You are a professional scriptwriter.
    
    Podcast Title: {outline.get('title')}
    Summary: {outline.get('summary')}
    Key Topics: {', '.join(outline.get('topics', []))}
    Context/Sources:
    {source_context}
    
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
    
    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            response_mime_type="application/json"
        )
    )
    
    try:
        result = json.loads(response.text)
        # Handle cases where it might return a list directly or wrapped in "script"
        if isinstance(result, list):
            return result
        return result.get("script", [])
    except json.JSONDecodeError:
        raise ValueError("Failed to parse generated script as JSON")
