import pytest
import warnings
from unittest.mock import patch, MagicMock

# Needs to be set before importing services.py
import django
from django.conf import settings

# Minimal Django settings configuration for testing
if not settings.configured:
    settings.configure(
        GEMINI_API_KEY='test_api_key',
    )
    django.setup()

from podcasts.services import generate_plan, generate_script

@pytest.fixture
def mock_gemini_client():
    with patch('podcasts.services.genai.Client') as mock_client:
        mock_instance = MagicMock()
        mock_client.return_value = mock_instance
        yield mock_instance

def test_generate_plan_success(mock_gemini_client):
    """Test generating a podcast plan with a mocked Gemini response."""
    # Mock the search response
    mock_search_response = MagicMock()
    mock_search_response.text = "This is a summary of the research."
    
    # Mock grounding chunks
    mock_chunk = MagicMock()
    mock_chunk.web.uri = "https://example.com"
    mock_chunk.web.title = "Example Site"
    
    mock_candidate = MagicMock()
    mock_candidate.grounding_metadata.grounding_chunks = [mock_chunk]
    mock_search_response.candidates = [mock_candidate]
    
    # Mock the outline response
    mock_outline_response = MagicMock()
    mock_outline_response.text = '''
    {
      "title": "Test Title",
      "summary": "Test Summary",
      "topics": ["Topic 1", "Topic 2"]
    }
    '''
    
    # Set the return values for the mock client
    mock_gemini_client.models.generate_content.side_effect = [
        mock_search_response,
        mock_outline_response
    ]
    
    result = generate_plan("Test Topic")
    
    assert 'outline' in result
    assert result['outline']['title'] == "Test Title"
    assert result['outline']['topics'] == ["Topic 1", "Topic 2"]
    
    assert 'sources' in result
    assert len(result['sources']) == 1
    assert result['sources'][0]['uri'] == "https://example.com"


def test_generate_script_success(mock_gemini_client):
    """Test generating a podcast script from a plan with a mocked Gemini response."""
    # Setup mock outline
    outline = {
      "title": "Test Title",
      "summary": "Test Summary",
      "topics": ["Topic 1", "Topic 2"]
    }
    
    # Mock the script response
    mock_script_response = MagicMock()
    mock_script_response.text = '''
    {
        "script": [
            { "speaker": "Host", "voice": "en-US-GuyNeural", "pitch": "+0Hz", "rate": "+0%", "text": "Welcome!" },
            { "speaker": "Guest", "voice": "en-US-AnaNeural", "pitch": "+5Hz", "rate": "+10%", "text": "Hello!" }
        ]
    }
    '''
    
    mock_gemini_client.models.generate_content.return_value = mock_script_response
    
    result = generate_script(outline, sources=[])
    
    assert len(result) == 2
    assert result[0]['speaker'] == "Host"
    assert result[0]['text'] == "Welcome!"
    assert result[1]['speaker'] == "Guest"
    assert result[1]['voice'] == "en-US-AnaNeural"


def test_generate_script_fallback_parsing(mock_gemini_client):
    """Test generating a podcast script where Gemini returns markdown rather than pure JSON."""
    outline = {
      "title": "Test Title",
    }
    
    # Mock the script response with markdown wrapper
    mock_script_response = MagicMock()
    mock_script_response.text = '''
    Here is the script you requested:
    ```json
    {
        "script": [
            { "speaker": "Host", "voice": "en-US-GuyNeural", "text": "Welcome to the show!" }
        ]
    }
    ```
    '''
    
    mock_gemini_client.models.generate_content.return_value = mock_script_response
    
    result = generate_script(outline, sources=[])
    
    assert len(result) == 1
    assert result[0]['speaker'] == "Host"
    assert result[0]['text'] == "Welcome to the show!"
