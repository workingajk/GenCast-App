import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { TopicInput } from '../components/TopicInput';
import { PlanningView } from '../components/PlanningView';
import { ScriptEditor } from '../components/ScriptEditor';
import { AudioPlayer } from '../components/AudioPlayer';
import { podcastService, authService } from '../services/api';

const HomePage = () => {
    // State
    const [step, setStep] = useState('input');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Data
    const [config, setConfig] = useState({ topic: '', speakers: 2 });
    const [podcastId, setPodcastId] = useState(null); // Track ID from backend
    const [outline, setOutline] = useState(null);
    const [sources, setSources] = useState([]);
    const [script, setScript] = useState([]);
    const [audioUrl, setAudioUrl] = useState(null);

    // Auth check
    useEffect(() => {
        if (!authService.isAuthenticated()) {
            navigate('/login');
        }
    }, [navigate]);

    // Handlers
    const handleGeneratePlan = async (topic, speakers) => {
        setLoading(true);
        setError(null);
        setConfig({ topic, speakers });

        try {
            // Call backend to create podcast plan
            const data = await podcastService.create(topic, speakers);
            setPodcastId(data.id);
            setOutline(data.outline);
            setSources(data.sources || []);
            setStep('planning');
        } catch (e) {
            console.error(e);
            if (e.response && e.response.status === 401) {
                 navigate('/login');
                 return;
            }
            setError("Failed to generate plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateScript = async () => {
        if (!podcastId) return;
        setLoading(true);
        setError(null);

        try {
            // Trigger backend script generation
            const data = await podcastService.generateScript(podcastId);
            setScript(data.script_content);
            setStep('scripting');
        } catch (e) {
            console.error(e);
            setError("Failed to generate script. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateScript = async (newScript) => {
        setScript(newScript);
        // Debounced save could be added here, currently saving on "next" or explicit save
        try {
            await podcastService.updateScript(podcastId, newScript);
        } catch (e) {
            console.error("Failed to auto-save script", e);
        }
    };

    const handleSynthesizeAudio = async () => {
        if (!podcastId) return;
        setLoading(true);
        setError(null);

        try {
            // First ensure latest script is saved
            await podcastService.updateScript(podcastId, script);
            
            // Trigger TTS
            const data = await podcastService.generateAudio(podcastId);
            
            if (data.audio_url) {
                // Determine full URL if relative
                const url = data.audio_url.startsWith('http') 
                    ? data.audio_url 
                    : `${import.meta.env.VITE_API_URL.replace('/api', '')}${data.audio_url}`;
                
                setAudioUrl(url);
                setStep('audio');
            } else {
                throw new Error("No audio URL returned");
            }

        } catch (e) {
            console.error(e);
            setError("Failed to synthesize audio. Check API quotas or connection.");
        } finally {
            setLoading(false);
        }
    };

    const reset = () => {
        setStep('input');
        setOutline(null);
        setScript([]);
        setAudioUrl(null);
        setError(null);
        setPodcastId(null);
    };

    return (
        <div className="flex flex-col items-center w-full min-h-screen pb-24 bg-bg-main text-text-main relative overflow-hidden transition-colors duration-500">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,189,199,0.08),transparent_50%)] pointer-events-none"></div>
            <header className="mb-12 text-center pt-12 relative z-10">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight font-heading mb-4 neon-text-glow dark:text-white">
                    Gen<span className="text-primary">Cast</span>
                </h1>
                <p className="text-text-muted font-medium max-w-xl mx-auto leading-relaxed">
                    Research-Based RAG Podcast Generation. Just provide a topic, and we'll handle the rest.
                </p>
                {/* Logout button for testing */}
                <button 
                    onClick={() => { authService.logout(); navigate('/login'); }}
                    className="absolute top-4 right-4 text-xs text-text-muted hover:text-red-500"
                >
                    Logout
                </button>
            </header>

            <StepIndicator currentStep={step} />

            <main className="w-full max-w-6xl px-4">
                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-center border border-red-100 max-w-2xl mx-auto">
                        {error}
                    </div>
                )}

                {step === 'input' && (
                    <TopicInput onGenerate={handleGeneratePlan} isGenerating={loading} />
                )}

                {step === 'planning' && outline && (
                    <PlanningView
                        outline={outline}
                        sources={sources}
                        onConfirm={handleGenerateScript}
                        isGeneratingScript={loading}
                    />
                )}

                {step === 'scripting' && (
                    <ScriptEditor
                        script={script}
                        setScript={handleUpdateScript}
                        onSynthesize={handleSynthesizeAudio}
                        isSynthesizing={loading}
                    />
                )}

                {step === 'audio' && (
                    <AudioPlayer
                        audioUrl={audioUrl}
                        onReset={reset}
                    />
                )}
            </main>
        </div>
    );
};

export default HomePage;

