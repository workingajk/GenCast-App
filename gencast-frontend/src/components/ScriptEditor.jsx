import React from 'react';
import { Play, Trash2, Plus, User, Download } from 'lucide-react';
import { clsx } from 'clsx';
import { SPEAKER_VOICE_MAP } from '../constants';

export const ScriptEditor = ({
    script,
    setScript,
    onSynthesize,
    isSynthesizing
}) => {

    const [selectedModel, setSelectedModel] = React.useState('edge');

    const updateLine = (id, field, value) => {
        const newScript = script.map(line =>
            line.id === id ? { ...line, [field]: value } : line
        );
        setScript(newScript);
    };

    const removeLine = (id) => {
        const newScript = script.filter(line => line.id !== id);
        setScript(newScript);
    };

    const addLine = (afterId) => {
        const idx = script.findIndex(l => l.id === afterId);
        const newLine = {
            id: Math.random().toString(36).substr(2, 9),
            speaker: idx >= 0 ? (script[idx].speaker === 'Host' ? 'Guest' : 'Host') : 'Host',
            text: ''
        };

        const newScript = [...script];
        newScript.splice(idx + 1, 0, newLine);
        setScript(newScript);
    };

    const handleExport = () => {
        const data = JSON.stringify(script, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'podcast-script.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="max-w-5xl mx-auto h-[calc(100vh-220px)] flex flex-col text-text-main transition-colors duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-6">
                <div>
                    <h3 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Script Editor</h3>
                    <p className="text-slate-500 dark:text-text-muted text-sm font-medium mt-2">Fine-tune the dialogue turn by turn to perfect your story.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={handleExport}
                        className="px-5 py-3.5 bg-white dark:bg-bg-surface border border-slate-200 dark:border-white/5 text-slate-600 dark:text-text-muted hover:text-slate-900 dark:hover:text-white rounded-2xl shadow-soft hover:shadow-md transition-all font-bold text-xs flex items-center gap-2"
                        title="Export Script to JSON"
                    >
                        <Download size={18} />
                        <span className="hidden sm:inline">Export</span>
                    </button>

                    <div className="relative group">
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="bg-white dark:bg-bg-surface border border-slate-200 dark:border-white/5 text-slate-700 dark:text-text-main text-xs font-bold px-5 py-3.5 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 cursor-pointer appearance-none pr-10 shadow-soft"
                        >
                            <option value="edge">Edge TTS</option>
                            <option value="gtts">gTTS (Std)</option>
                            <option value="chatterbox">Chatterbox Engine</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[18px]">expand_more</span>
                    </div>

                    <button
                        onClick={() => onSynthesize(selectedModel)}
                        disabled={isSynthesizing}
                        className="px-8 py-3.5 bg-primary hover:bg-primary-hover disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-text-muted text-[#0a0c0e] rounded-2xl font-black text-xs shadow-glow hover:shadow-[0_10px_30px_rgba(0,240,255,0.4)] transition-all flex items-center gap-2 active:scale-95"
                    >
                        {isSynthesizing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#0a0c0e]/30 border-t-[#0a0c0e] rounded-full animate-spin"></div>
                                <span>Developing...</span>
                            </>
                        ) : (
                            <>
                                <Play size={16} fill="currentColor" />
                                <span>Produce Audio</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-bg-surface rounded-[2.5rem] border border-slate-200 dark:border-white/5 overflow-hidden flex flex-col shadow-xl-saas relative transition-all duration-300">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
                    {script.map((line) => (
                        <div key={line.id} className="group relative flex gap-8 items-start hover:bg-slate-50 dark:hover:bg-white/[0.02] p-6 rounded-3xl transition-all">
                            {/* Speaker Avatar/Selector */}
                            <div className="flex flex-col items-center gap-4 shrink-0 w-32">
                                <div className={clsx(
                                    "size-14 flex items-center justify-center rounded-2xl shadow-soft transition-transform group-hover:scale-110",
                                    line.speaker.toLowerCase().includes('host')
                                        ? 'bg-primary text-[#0a0c0e]'
                                        : 'bg-slate-100 dark:bg-bg-main text-slate-400 dark:text-slate-500'
                                )}>
                                    <User size={28} strokeWidth={2.5} />
                                </div>
                                <div className="space-y-1 w-full text-center">
                                    <input
                                        type="text"
                                        value={line.speaker}
                                        onChange={(e) => updateLine(line.id, 'speaker', e.target.value)}
                                        className="w-full text-[10px] font-black text-center bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-white/10 focus:border-primary outline-none dark:text-white text-slate-900 uppercase tracking-widest transition-all"
                                    />
                                    <p className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-tight">
                                        {SPEAKER_VOICE_MAP[line.speaker] || 'Standard Voice'}
                                    </p>
                                </div>
                            </div>

                            {/* Text Editor */}
                            <div className="flex-1 pt-1">
                                <textarea
                                    value={line.text}
                                    onChange={(e) => updateLine(line.id, 'text', e.target.value)}
                                    className="w-full h-full min-h-[80px] bg-transparent border-0 focus:ring-0 p-0 text-slate-600 dark:text-text-muted focus:text-slate-900 dark:focus:text-white text-lg font-medium leading-relaxed resize-none outline-none placeholder:text-slate-300"
                                    placeholder="Enter dialogue..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => removeLine(line.id)}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-red-500 transition-all shadow-soft"
                                    title="Remove line"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => addLine(line.id)}
                                    className="p-2.5 rounded-xl text-slate-400 hover:text-slate-900 hover:bg-primary transition-all shadow-soft"
                                    title="Add line below"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="pt-4">
                        <button
                            onClick={() => addLine(script[script.length - 1]?.id || '0')}
                            className="w-full py-6 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[2rem] text-slate-400 dark:text-slate-600 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all flex items-center justify-center gap-3 font-bold text-sm"
                        >
                            <Plus size={20} />
                            Add Dialogue Turn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScriptEditor;
