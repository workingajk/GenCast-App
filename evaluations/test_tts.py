import pytest
import asyncio
from unittest.mock import patch, MagicMock

from podcasts.tts import synthesize_podcast

@pytest.mark.asyncio
async def test_synthesize_podcast_edge_tts():
    """Test the synthesize_podcast function using the default edge-tts engine directly."""
    script = [
        {"speaker": "Host", "text": "Hello world", "voice": "en-US-GuyNeural", "pitch": "+0Hz", "rate": "+0%"}
    ]
    
    # We want to mock out synthesize_line_edge returning dummy bytes
    with patch('podcasts.tts.synthesize_line_edge') as mock_synth:
        mock_synth.return_value = b"dummy_mp3_data"
        
        segments = await synthesize_podcast(script, model='edge')
        
        # Verify the mock was called correctly
        mock_synth.assert_called_once_with("Hello world", "en-US-GuyNeural", "+0Hz", "+0%")
        
        assert len(segments) == 1
        assert segments[0] == b"dummy_mp3_data"


@pytest.mark.asyncio
async def test_synthesize_podcast_gtts():
    """Test the synthesize_podcast function using the gtts engine directly."""
    script = [
        {"speaker": "Guest", "text": "Hello world", "voice": "en-US-JennyNeural"}
    ]
    
    # We don't want to mock asyncio.to_thread because the function relies on the thread 
    # executing to populate the `mp3_io` buffer. Instead, we just mock `gTTS`.
    with patch('podcasts.tts.gTTS') as mock_gtts_class:
        mock_gtts_instance = MagicMock()
        
        # When write_to_fp is called inside the thread, it modifies the provided fp
        def mock_write(fp):
            fp.write(b"dummy_gtts_data")
        mock_gtts_instance.write_to_fp.side_effect = mock_write
        
        mock_gtts_class.return_value = mock_gtts_instance
        
        segments = await synthesize_podcast(script, model='gtts')
        
        # Because gTTS does its own magic with tld, check that
        mock_gtts_class.assert_called_once_with(text="Hello world", lang="en", tld="co.uk")
        
        assert len(segments) == 1
        assert segments[0] == b"dummy_gtts_data"

@pytest.mark.asyncio
async def test_synthesize_podcast_empty_text():
    """Test that empty dialogue turns space are correctly skipped."""
    script = [
        {"speaker": "Host", "text": "   ", "voice": "en-US-GuyNeural"}
    ]
    
    with patch('podcasts.tts.synthesize_line_edge') as mock_synth:
        segments = await synthesize_podcast(script, model='edge')
        mock_synth.assert_not_called()
        assert len(segments) == 0
