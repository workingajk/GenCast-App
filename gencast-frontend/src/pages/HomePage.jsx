import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StepIndicator } from '../components/StepIndicator';
import { TopicInput } from '../components/TopicInput';
import { PlanningView } from '../components/PlanningView';
import { ScriptEditor } from '../components/ScriptEditor';
import { AudioPlayer } from '../components/AudioPlayer';
import { podcastService, authService } from '../services/api';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
    // State
    const [step, setStep] = useState('input');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    // Data
    const [config, setConfig] = useState({ topic: '', speakers: 2, characteristics: [] });
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
    const handleGeneratePlan = async (topic, speakers, characteristics) => {
        setLoading(true);
        setError(null);
        setConfig({ topic, speakers, characteristics });

        try {
            // Call backend to create podcast plan
            const data = await podcastService.create(topic, speakers, characteristics);
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
            
            // Ensure every script line has a unique ID for the editor
            let generatedScript = data.script_content || [];
            if (Array.isArray(generatedScript)) {
                generatedScript = generatedScript.map(line => ({
                    ...line,
                    id: line.id || Math.random().toString(36).substr(2, 9)
                }));
            }
            
            setScript(generatedScript);
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

    const handleSynthesizeAudio = async (selectedModel) => {
        if (!podcastId) return;
        setLoading(true);
        setError(null);

        try {
            // First ensure latest script is saved
            await podcastService.updateScript(podcastId, script);

            // Trigger TTS
            const data = await podcastService.generateAudio(podcastId, selectedModel);

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
        <div className="flex flex-col items-center w-full min-h-screen pb-24 bg-slate-50 dark:bg-bg-main text-text-main relative overflow-x-hidden transition-colors duration-500 selection:bg-primary/20">
            {/* Soft Ambient Background */}
            <div className="absolute inset-0 bg-soft-bg opacity-40 pointer-events-none"></div>
            
            <button 
                onClick={toggleTheme}
                className="absolute top-6 right-6 flex items-center justify-center size-12 bg-white dark:bg-bg-surface text-text-main hover:text-primary transition-all rounded-full shadow-soft hover:shadow-xl active:scale-95 z-40 border border-slate-200 dark:border-white/5"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
                <span className="material-symbols-outlined text-[20px] transition-transform duration-500">
                    {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
            </button>

            <header className="mb-20 text-center relative z-10 pt-16 flex flex-col items-center w-full max-w-4xl px-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                    <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
                    AI Podcast Engine
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight dark:text-white text-slate-900 mb-6">
                    Gen<span className="text-primary">Cast</span>
                </h1>
                <p className="text-slate-500 dark:text-text-muted text-lg md:text-xl max-w-2xl font-medium leading-relaxed">
                    Create studio-quality podcasts from any topic using specialized AI agents. 
                    Research, script, and synthesize in minutes.
                </p>
            </header>

            <div className="relative z-10 w-full flex justify-center mb-8">
                <StepIndicator currentStep={step} />
            </div>

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

