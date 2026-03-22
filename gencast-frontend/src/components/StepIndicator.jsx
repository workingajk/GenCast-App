import React from 'react';
import { clsx } from 'clsx';

const steps = [
    { id: 'input', label: 'Topic & Config' },
    { id: 'planning', label: 'Research & Plan' },
    { id: 'scripting', label: 'Script Editor' },
    { id: 'audio', label: 'Audio Synthesis' },
];

export const StepIndicator = ({ currentStep }) => {
    const currentIdx = steps.findIndex(s => s.id === currentStep);

    return (
        <div className="w-full max-w-4xl mx-auto mb-8 px-4">
            <div className="relative flex justify-between">
                {/* Connecting Line */}
                <div className="absolute top-6 left-0 w-full h-2 bg-black/10 dark:bg-border-main -z-10 -translate-y-1/2"></div>
                <div
                    className="absolute top-6 left-0 h-2 bg-primary border-y-2 border-r-2 border-[#0a0c0e] dark:border-primary -z-10 -translate-y-1/2 transition-all duration-500"
                    style={{ width: `${(currentIdx / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, idx) => {
                    const isActive = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;
                    return (
                        <div key={step.id} className="flex flex-col items-center gap-3 relative z-10 transition-colors duration-300">
                            <div
                                className={clsx(
                                    "w-12 h-12 flex items-center justify-center text-sm font-black border-4 transition-all duration-300",
                                    isActive 
                                        ? "bg-primary border-[#0a0c0e] text-[#0a0c0e] shadow-[4px_4px_0px_#0a0c0e] dark:shadow-[4px_4px_0px_#00f0ff]" 
                                        : "bg-white dark:bg-bg-main border-[#0a0c0e] dark:border-border-main text-[#0a0c0e]/50 dark:text-text-muted shadow-[4px_4px_0px_rgba(10,12,14,0.1)] dark:shadow-[4px_4px_0px_rgba(0,0,0,1)]",
                                    isCurrent && "scale-110 -translate-y-1 bg-[#00f0ff]"
                                )}
                            >
                                {idx + 1}
                            </div>
                            <span
                                className={clsx(
                                    "text-[10px] font-bold uppercase tracking-widest hidden sm:block transition-colors",
                                    isActive ? "text-primary" : "text-text-muted"
                                )}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
