import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { podcastService, authService } from '../services/api';
import { ScriptEditor } from '../components/ScriptEditor';
import { AudioPlayer } from '../components/AudioPlayer';
import { Loader2 } from 'lucide-react';

const PlayerPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [podcast, setPodcast] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSynthesizing, setIsSynthesizing] = useState(false);

    useEffect(() => {
        loadPodcast();
    }, [id]);

    const loadPodcast = async () => {
        try {
            setLoading(true);
            const data = await podcastService.get(id);
            setPodcast(data);
        } catch (e) {
            console.error("Failed to load podcast", e);
            if (e.response && e.response.status === 401) {
                navigate('/login');
            } else {
                setError("Failed to load podcast. It might not exist.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateScript = async (newScript) => {
        // Optimistic update
        setPodcast(prev => ({ ...prev, script_content: newScript }));
        try {
            await podcastService.updateScript(id, newScript);
        } catch (e) {
            console.error("Failed to save script", e);
            // Revert or notify (omitted for simplicity)
        }
    };

    const handleSynthesize = async (selectedModel) => {
        setIsSynthesizing(true);
        try {
            // Save script first
            if (podcast.script_content) {
                await podcastService.updateScript(id, podcast.script_content);
            }

            const data = await podcastService.generateAudio(id, selectedModel);
            // Refresh podcast data to get new audio URL
            setPodcast(prev => ({
                ...prev,
                status: 'completed',
                audio_file: data.audio_url || data.audio_file // API might return audio_url or check serializer
            }));
            // Reload fully to be safe about URL formats
            loadPodcast();

        } catch (e) {
            console.error("Failed to synthesize", e);
            alert("Failed to synthesize audio");
        } finally {
            setIsSynthesizing(false);
        }
    };

    const getAudioUrl = () => {
        if (!podcast?.audio_file) return null;
        if (podcast.audio_file.startsWith('http')) return podcast.audio_file;
        return `${import.meta.env.VITE_API_URL.replace('/api', '')}${podcast.audio_file}`;
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main text-text-main">
                <Loader2 className="animate-spin mb-4 text-primary" size={32} />
                <p className="text-text-muted">Loading Podcast...</p>
            </div>
        );
    }

    if (error || !podcast) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-bg-main text-text-main p-4">
                <h2 className="text-2xl font-bold text-red-500 mb-2">Error</h2>
                <p className="text-text-muted mb-6">{error || "Podcast not found"}</p>
                <button
                    onClick={() => navigate('/')}
                    className="px-6 py-2 bg-bg-surface border border-border-main rounded-xl hover:bg-bg-surface/80 transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-bg-main text-text-main font-display min-h-screen w-full flex flex-col transition-colors duration-500 relative pb-20 overflow-y-auto custom-scrollbar">
            <div className="absolute inset-x-0 top-0 h-[40vh] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>

            <header className="max-w-6xl mx-auto w-full p-6 flex items-center justify-between relative z-10">
                <button
                    onClick={() => navigate('/')}
                    className="text-text-muted hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Back
                </button>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-bg-surface border border-border-main text-[10px] font-bold uppercase tracking-widest text-text-muted">
                        {podcast.status}
                    </div>
                    <button
                        onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this podcast?')) {
                                try {
                                    await podcastService.delete(podcast.id);
                                    navigate('/');
                                } catch (err) {
                                    console.error("Failed to delete podcast", err);
                                    alert("Failed to delete podcast");
                                }
                            }
                        }}
                        className="p-1.5 flex items-center justify-center rounded-full text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors shadow-sm"
                        title="Delete Podcast"
                    >
                        <span className="material-symbols-outlined block text-[18px]">delete</span>
                    </button>
                </div>
            </header>

            <div className="max-w-4xl mx-auto w-full relative z-10 px-4">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-black dark:text-white tracking-tighter mb-4 font-heading">{podcast.title || podcast.topic}</h1>
                    <p className="text-lg text-text-muted font-bold tracking-tight">
                        Generated Podcast • {new Date(podcast.created_at).toLocaleDateString()}
                    </p>
                </div>

                {/* Audio Player */}
                {podcast.audio_file ? (
                    <div className="mb-16">
                        <AudioPlayer
                            audioUrl={getAudioUrl()}
                            onReset={() => navigate('/')} // Redirect to home on "New Project"
                        />
                    </div>
                ) : (
                    <div className="text-center mb-12 p-8 bg-bg-surface rounded-[2rem] border border-border-main border-dashed opacity-50">
                        <p className="text-text-muted font-bold uppercase tracking-widest text-sm">No Audio Generated Yet</p>
                    </div>
                )}

                {/* Script Editor */}
                <div className="mt-8">
                    <ScriptEditor
                        script={podcast.script_content || []}
                        setScript={handleUpdateScript}
                        onSynthesize={handleSynthesize}
                        isSynthesizing={isSynthesizing}
                    />
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
