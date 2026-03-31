"""
rag_service.py

Adaptive RAG-based podcast planning pipeline using Tavily for web retrieval
and Gemini for coverage checking and outline/script generation.

This is the research alternative to the Gemini-grounding pipeline in services.py.
Both produce the same output format so they can be directly compared.

Pipeline:
    Topic
      -> Initial Tavily search (broad)
      -> Coverage check (LLM identifies gaps)
      -> Optional targeted second Tavily search
      -> Final context assembly
      -> Outline generation (LLM + retrieved context)
"""

from tavily import TavilyClient
from openai import OpenAI
from django.conf import settings
import json
import re
import os
import requests


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def get_tavily_client():
    if not settings.TAVILY_API_KEY:
        raise ValueError("TAVILY_API_KEY not configured")
    return TavilyClient(api_key=settings.TAVILY_API_KEY)


def get_local_llm_client():
    url = getattr(settings, 'LOCAL_LLM_URL', os.getenv('LOCAL_LLM_URL', 'http://localhost:11434/v1'))
    return OpenAI(base_url=url, api_key='ollama')

def get_local_llm_model():
    return getattr(settings, 'LOCAL_LLM_MODEL', os.getenv('LOCAL_LLM_MODEL', 'llama3.2'))


def _format_snippets(results: list) -> str:
    """Format Tavily results into a clean text block for LLM context."""
    lines = []
    for i, r in enumerate(results, 1):
        title   = r.get("title", "Untitled")
        url     = r.get("url", "")
        content = r.get("content", "").strip()
        lines.append(f"[Source {i}] {title} ({url})\n{content}")
    return "\n\n".join(lines)


def _extract_sources(results: list) -> list:
    """Extract source metadata from Tavily results."""
    sources = []
    seen = set()
    for r in results:
        url = r.get("url", "")
        if url and url not in seen:
            sources.append({
                "title": r.get("title", url),
                "uri":   url,
            })
            seen.add(url)
    return sources

def _fetch_jina_content(url: str) -> str:
    """Fallback: Use Jina Reader API to extract Markdown content from blocked websites."""
    try:
        jina_url = f"https://r.jina.ai/{url}"
        response = requests.get(jina_url, timeout=12)
        if response.status_code == 200:
            content = response.text.strip()
            # If the response is extremely massive, truncate it to save LLM context
            return content[:2500] if len(content) > 2500 else content
    except Exception as e:
        print(f"[RAG] Jina fallback failed for {url}: {e}")
    return ""


# ---------------------------------------------------------------------------
# Step 1: Initial broad retrieval
# ---------------------------------------------------------------------------

def initial_retrieval(topic: str, tavily: TavilyClient) -> tuple[list, list]:
    """
    Broad search for the topic. Returns (results, sources).
    Uses 'advanced' search depth to get more comprehensive content.
    """
    response = tavily.search(
        query        = f"{topic} comprehensive overview key facts",
        search_depth = "advanced",
        max_results  = 10,  # Fetch more to filter out garbage
        include_raw_content = False,
    )
    
    valid_results = []
    for r in response.get("results", []):
        content = r.get("content", "")
        if len(content) < 800:
            url = r.get("url", "")
            if url:
                print(f"[RAG] Content too short ({len(content)} chars), attempting Jina fallback for: {url}")
                fallback = _fetch_jina_content(url)
                if len(fallback) > 800:
                    r["content"] = fallback
                    valid_results.append(r)
        else:
            valid_results.append(r)
            
    # Cap back down to 5 high-quality results
    valid_results = valid_results[:5]
    return valid_results, _extract_sources(valid_results)


# ---------------------------------------------------------------------------
# Step 2: Coverage check
# ---------------------------------------------------------------------------

def coverage_check(topic: str, snippets_text: str, speaker_count: int, client) -> list[str]:
    """
    Ask Gemini to identify sub-topics not yet covered in the retrieved snippets.
    Returns a list of gap queries to search for, or empty list if coverage is sufficient.
    """
    prompt = f"""
You are an expert podcast producer evaluating research coverage.

Topic: "{topic}"
Target: A {speaker_count}-speaker podcast episode covering ALL important aspects.

Retrieved research so far:
{snippets_text}

Task:
Identify any IMPORTANT sub-topics or angles that are NOT adequately covered
in the research above. These gaps would leave the podcast incomplete or shallow.

If coverage is sufficient, return: {{"gaps": []}}
If there are gaps, return up to 3 specific search queries to fill them:
{{"gaps": ["specific search query 1", "specific search query 2"]}}

Return ONLY valid JSON, nothing else.
"""
    response = client.chat.completions.create(
        model=get_local_llm_model(),
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    try:
        data = json.loads(response.choices[0].message.content or "{}")
        return data.get("gaps", [])
    except json.JSONDecodeError:
        return []  # If parsing fails, assume coverage is ok


# ---------------------------------------------------------------------------
# Step 3: Targeted second retrieval
# ---------------------------------------------------------------------------

def targeted_retrieval(gap_queries: list[str], tavily: TavilyClient) -> tuple[list, list]:
    """
    Run targeted searches for each identified gap.
    Returns (results, sources).
    """
    all_results = []
    for query in gap_queries[:3]:  # Cap at 3 gap searches
        response = tavily.search(
            query        = query,
            search_depth = "basic",
            max_results  = 5,  # Fetch 5 to filter out garbage
        )
        
        valid_chunk = []
        for r in response.get("results", []):
            content = r.get("content", "")
            if len(content) < 800:
                url = r.get("url", "")
                if url:
                    print(f"[RAG] Content too short ({len(content)} chars), attempting Jina fallback for: {url}")
                    fallback = _fetch_jina_content(url)
                    if len(fallback) > 800:
                        r["content"] = fallback
                        valid_chunk.append(r)
            else:
                valid_chunk.append(r)
                
        all_results.extend(valid_chunk[:3]) # Take top 3 valid ones per gap
    return all_results, _extract_sources(all_results)


# ---------------------------------------------------------------------------
# Step 4: Outline generation with full context
# ---------------------------------------------------------------------------

def generate_outline_from_context(topic: str, context: str, speaker_count: int, client) -> dict:
    """
    Generate a structured podcast outline given retrieved context.
    """
    prompt = f"""
You are an expert podcast producer.
Topic: "{topic}"
Target format: A structured podcast with {speaker_count} speakers.

Research Material (retrieved from the web):
{context}

Task:
Create a high-level outline for a 5-minute podcast episode based ONLY on the
research material above. The outline should include a catchy title, a brief
summary, and 4-5 key discussion points (subtopics).

Return ONLY a valid JSON object with this exact structure:
{{
  "title": "Episode Title",
  "summary": "Brief summary of the episode...",
  "topics": ["Topic 1", "Topic 2", "Topic 3", "Topic 4"]
}}
"""
    response = client.chat.completions.create(
        model=get_local_llm_model(),
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    try:
        return json.loads(response.choices[0].message.content or "{}")
    except json.JSONDecodeError:
        # Fallback: try regex extraction
        match = re.search(r'\{.*\}', response.choices[0].message.content or "", re.DOTALL)
        if match:
            return json.loads(match.group(0))
        return {"title": topic, "summary": "", "topics": []}


# ---------------------------------------------------------------------------
# Main entry point — same interface as generate_plan() in services.py
# ---------------------------------------------------------------------------

def generate_plan_rag(topic: str, speaker_count: int = 2) -> dict:
    """
    Adaptive RAG podcast planning pipeline.

    Returns:
        {
            "outline":  { "title": ..., "summary": ..., "topics": [...] },
            "sources":  [ { "title": ..., "uri": ... }, ... ],
            "pipeline": {                          # Research metadata
                "initial_results":   int,
                "gaps_found":        list[str],
                "targeted_results":  int,
                "total_sources":     int,
            }
        }
    """
    tavily = get_tavily_client()
    local_llm = get_local_llm_client()

    # Step 1: Initial broad retrieval
    print(f"[RAG] Step 1: Initial retrieval for '{topic}'")
    initial_results, initial_sources = initial_retrieval(topic, tavily)
    initial_text = _format_snippets(initial_results)

    # Step 2: Coverage check
    print(f"[RAG] Step 2: Coverage check ({len(initial_results)} snippets retrieved)")
    gaps = coverage_check(topic, initial_text, speaker_count, local_llm)
    print(f"[RAG]         Gaps identified: {gaps if gaps else 'None — coverage sufficient'}")

    # Step 3: Optional targeted retrieval
    targeted_results = []
    targeted_sources = []
    if gaps:
        print(f"[RAG] Step 3: Targeted retrieval for {len(gaps)} gap(s)")
        targeted_results, targeted_sources = targeted_retrieval(gaps, tavily)
        print(f"[RAG]         Retrieved {len(targeted_results)} additional snippets")
    else:
        print(f"[RAG] Step 3: Skipped — coverage sufficient")

    # Step 4: Assemble final context
    all_results = initial_results + targeted_results
    final_text  = _format_snippets(all_results)

    # Merge and deduplicate sources
    seen_uris = set()
    all_sources = []
    for s in initial_sources + targeted_sources:
        if s["uri"] not in seen_uris:
            all_sources.append(s)
            seen_uris.add(s["uri"])

    # Step 5: Generate outline
    print(f"[RAG] Step 4: Generating outline from {len(all_results)} snippets")
    outline = generate_outline_from_context(topic, final_text, speaker_count, local_llm)

    return {
        "outline": outline,
        "sources": all_sources,
        "context_text": final_text,
        "pipeline": {
            "initial_results":  len(initial_results),
            "gaps_found":       gaps,
            "targeted_results": len(targeted_results),
            "total_sources":    len(all_sources),
        }
    }


# ---------------------------------------------------------------------------
# Step 6: Script Generation (RAG variant)
# ---------------------------------------------------------------------------

def generate_script_rag(outline: dict, context_text: str, speaker_count: int = 2, speaker_characteristics: list = None) -> list:
    """
    Generates a podcast script using Gemini 2.5 Flash with structured JSON output,
    but crucially WITHOUT the Google Search tool. Uses the provided RAG context_text instead.
    Returns list of { speaker: "Host", text: "..." }
    """
    client = get_local_llm_client()
    
    characteristics_context = ""
    if speaker_characteristics and isinstance(speaker_characteristics, list) and len(speaker_characteristics) > 0:
        characteristics_context = "Speaker Characteristics:\n"
        for i, char in enumerate(speaker_characteristics):
            speaker_label = f"Speaker {i+1}"
            if i == 0: speaker_label = "Host"
            elif i == 1: speaker_label = "Guest"
            characteristics_context += f"- {speaker_label}: {char}\n"
        characteristics_context += "\nIMPORTANT: Ensure the dialogue reflects each speaker's distinct personality, knowledge level, role, and background as defined above. Their tone and style must match these characteristics exactly.\n"
    
    available_voices_context = """
    Available Voices for Selection:
    - en-US-GuyNeural (Male, Adult)
    - en-US-JennyNeural (Female, Adult)
    - en-US-AriaNeural (Female, Adult)
    - en-US-AnaNeural (Female, Child, young and bright)
    - en-US-ChristopherNeural (Male, Adult)
    - en-US-EricNeural (Male, Adult, deep or older voice)
    - en-US-MichelleNeural (Female, Adult)
    - en-US-RogerNeural (Male, Adult)
    - en-US-SteffanNeural (Male, Adult)
    """

    prompt = f"""
    You are a professional scriptwriter.
    
    Podcast Title: {outline.get('title')}
    Summary: {outline.get('summary')}
    Key Topics: {', '.join(outline.get('topics', []))}
    
    Research Material (retrieved from the web):
    {context_text}
    
    {characteristics_context}
    
    {available_voices_context}
    
    Task:
    Write a natural, engaging podcast script for {speaker_count} speakers.
    You MUST ground the conversation heavily in the specific facts provided in the "Research Material" section above. Do NOT make up facts.
    The speakers should be labeled strictly as "Host", "Guest", "Speaker 3", etc. to match the given characteristics.
    The dialogue should flow naturally, be highly informative, and follow the provided outline.
    Include approximately 10-15 dialogue turns.
    
    CRITICAL INSTRUCTION FOR VOICE ACTING:
    For each line of dialogue, you MUST assign an appropriate `voice` ONLY from the "Available Voices" list above that best matches the speaker's characteristics.
    You MUST also optionally specify `pitch` and `rate` to accurately reflect their age and energy level if it deviates from a standard adult. 
    FORMAT RULES FOR PITCH AND RATE:
    - `pitch` MUST be formatted as "+<number>Hz" or "-<number>Hz" (e.g., "+10Hz", "-5Hz"). 
    - `rate` MUST be formatted as "+<number>%" or "-<number>%" (e.g., "+5%", "-10%").
    - If no adjustment is needed, default to "+0Hz" and "+0%".

    Return ONLY a valid JSON dictionary with a "script" key containing a list of objects.
    Example:
    {{
        "script": [
            {{ "speaker": "Host", "voice": "en-US-GuyNeural", "pitch": "+0Hz", "rate": "+0%", "text": "Welcome to the show!" }},
            {{ "speaker": "Guest", "voice": "en-US-AnaNeural", "pitch": "+5Hz", "rate": "+10%", "text": "Thanks for having me, I'm super excited!" }}
        ]
    }}
    """
    
    response = client.chat.completions.create(
        model=get_local_llm_model(),
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"}
    )
    
    try:
        data = json.loads(response.choices[0].message.content or "{}")
        return data.get("script", [])
    except json.JSONDecodeError:
        match = re.search(r'\{.*\}', response.choices[0].message.content or "", re.DOTALL)
        if match:
             try:
                 return json.loads(match.group(0)).get("script", [])
             except:
                 pass
        
        # Fallback dummy script
        return [
            {"speaker": "Host", "voice": "en-US-GuyNeural", "text": "Welcome to the podcast. We had an error generating the script."},
            {"speaker": "Guest", "voice": "en-US-JennyNeural", "text": "Oh no, that is unfortunate."}
        ]
