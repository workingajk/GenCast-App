import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-slate-50 dark:bg-bg-main text-text-main transition-colors duration-500 overflow-hidden font-sans">
            <Sidebar />
            <main className="flex-1 relative overflow-y-auto">
                <div className="max-w-7xl mx-auto px-6 py-12 md:px-12 pb-32 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
