import { useTheme } from '../context/ThemeContext';

const Header = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="flex items-center justify-end px-8 py-4 absolute top-0 right-0 left-0 z-30">
            <div className="flex gap-2">
                <button className="flex items-center justify-center size-9 rounded-full bg-surface-dark border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>
                <button 
                    onClick={toggleTheme}
                    className="flex items-center justify-center size-9 rounded-full bg-primary text-[#0a0c0e] hover:bg-primary-hover transition-all border border-primary/20 shadow-[0_0_15px_rgba(0,189,199,0.2)]"
                    title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                    <span className="material-symbols-outlined text-[20px] font-bold transition-transform duration-500 scale-100 rotate-0">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>
            </div>
        </header>
    );
};

export default Header;
