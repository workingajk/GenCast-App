import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
    return (
        <div className="bg-bg-deep text-gray-100 font-display overflow-hidden h-screen flex">
            <Sidebar />
            <main className="flex-1 flex flex-col relative h-full min-w-0 bg-bg-deep overflow-hidden">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center w-full px-6 overflow-y-auto pt-16">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
