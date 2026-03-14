import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex h-screen bg-bg-main text-text-main transition-colors duration-500 overflow-hidden font-display">
            <Sidebar />
            <main className="flex-1 relative overflow-y-auto">
                <div className="container mx-auto px-6 pb-24 min-h-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
