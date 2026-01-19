import React from 'react';

const Header = () => {
    return (
        <header className="flex items-center justify-end px-8 py-4 absolute top-0 right-0 left-0 z-10">
            <div className="flex gap-2">
                <button className="flex items-center justify-center size-9 rounded-full bg-bg-surface text-gray-400 hover:text-white hover:bg-bg-input transition-all border border-white/5">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <button className="flex items-center justify-center size-9 rounded-full bg-primary text-[#0a0c0e] hover:bg-primary-hover transition-all border border-primary/20">
                    <span className="material-symbols-outlined text-[20px] font-bold">light_mode</span>
                </button>
            </div>
        </header>
    );
};

export default Header;
