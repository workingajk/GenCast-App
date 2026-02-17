import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, RotateCcw, CheckCircle } from 'lucide-react';

export const AudioPlayer = ({ audioUrl, onReset }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!audioRef.current) return;
        
        const audio = audioRef.current;
        
        const updateProgress = () => {
            if (audio.duration) {
                setProgress((audio.currentTime / audio.duration) * 100);
            }
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setProgress(100);
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleEnded);
        
        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleSeek = (e) => {
        if (!audioRef.current || !audioRef.current.duration) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(Math.max(x / rect.width, 0), 1);
        
        audioRef.current.currentTime = percentage * audioRef.current.duration;
        setProgress(percentage * 100);
    };

    const formatTime = (seconds) => {
        if (!seconds) return "0:00";
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="max-w-2xl mx-auto text-center space-y-10 text-text-main transition-colors duration-300">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />
            
            <div className="bg-primary/5 text-primary p-10 rounded-[3rem] border border-primary/20 flex flex-col items-center gap-6 shadow-glow relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
                <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center border border-primary/20 shadow-glow group-hover:scale-110 transition-transform duration-500">
                    <CheckCircle size={40} className="drop-shadow-glow" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold dark:text-white font-heading mb-2">Podcast Synthesized!</h2>
                    <p className="text-text-muted font-medium tracking-wide">Your episode is ready for the world.</p>
                </div>
            </div>

            <div className="bg-bg-surface p-10 rounded-[3rem] border border-border-main relative overflow-hidden shadow-xl dark:shadow-2xl transition-all duration-300">
                {/* Visualizer bg (simulated) */}
                <div className="absolute inset-x-0 bottom-0 top-1/2 flex items-end justify-center opacity-[0.05] gap-2 pointer-events-none px-4">
                    {[...Array(30)].map((_, i) => (
                        <div key={i} className="w-full max-w-[8px] bg-primary rounded-t-full" style={{ height: `${Math.random() * 80 + 20}%` }}></div>
                    ))}
                </div>

                <div className="relative z-10 space-y-8">
                    <div className="flex items-center justify-between text-[11px] font-bold text-text-muted tracking-[0.2em] uppercase">
                        <span className="bg-primary/5 px-3 py-1 rounded-full">{formatTime(audioRef.current?.currentTime)}</span>
                        <span className="bg-primary/5 px-3 py-1 rounded-full">{formatTime(audioRef.current?.duration)}</span>
                    </div>

                    <div 
                        className="h-2.5 bg-bg-main rounded-full overflow-hidden relative border border-border-main group/progress cursor-pointer"
                        onClick={handleSeek}
                    >
                        <div
                            className="h-full bg-gradient-to-r from-primary/50 to-primary transition-all duration-100 ease-linear shadow-glow"
                            style={{ width: `${progress}%` }}
                        ></div>
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 h-4 w-4 bg-white dark:bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 shadow-glow transition-opacity" style={{ left: `calc(${progress}% - 8px)` }}></div>
                    </div>

                    <div className="flex items-center justify-center gap-10">
                        <button
                            onClick={onReset}
                            className="p-4 text-text-muted hover:text-text-main hover:bg-primary/5 rounded-2xl transition-all"
                            title="Restart"
                        >
                            <RotateCcw size={28} />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-24 h-24 bg-primary hover:bg-primary-hover text-[#0a0c0e] rounded-[2.5rem] flex items-center justify-center shadow-glow hover:shadow-[0_20px_50px_rgba(0,189,199,0.4)] transition-all transform hover:-translate-y-1 active:scale-95"
                        >
                            {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
                        </button>

                        <a
                            href={audioUrl}
                            download="podcast.mp3"
                            className="p-4 text-text-muted hover:text-text-main hover:bg-primary/5 rounded-2xl transition-all flex items-center justify-center"
                            title="Download Audio"
                        >
                            <Download size={28} />
                        </a>
                    </div>
                </div>
            </div>

            <button
                onClick={onReset}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary hover:text-primary-hover transition-colors border-b border-primary/20 hover:border-primary-hover pb-1"
            >
                Start New Project
            </button>
        </div>
    );
};
