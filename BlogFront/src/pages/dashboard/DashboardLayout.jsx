import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, LogOut, Key, User, ChevronDown, FileText } from 'lucide-react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTES } from '../../config/routes';

export default function DashboardLayout() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        await authService.logout();
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
                <div className="flex items-center gap-2 mb-10">
                    <LayoutDashboard className="text-indigo-600" />
                    <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
                </div>

                <nav className="space-y-4">
                    <Link to={ROUTES.HOME} className="flex items-center gap-3 text-indigo-600 font-medium bg-indigo-50 p-3 rounded-xl w-full transition-colors">
                        <User size={20} /> Overview
                    </Link>

                    <Link to={ROUTES.POSTS} className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 font-medium p-3 rounded-xl w-full transition-colors">
                        <FileText size={20} /> Posts
                    </Link>
                </nav>
            </aside>

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="bg-white shadow-sm h-16 px-8 flex items-center justify-between z-40">
                    <h2 className="text-lg font-semibold text-gray-800 md:hidden">My Dashboard</h2>
                    <div className="hidden md:block"></div>

                    {/* Account Dropdown Section */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center gap-3 focus:outline-none bg-gray-50 hover:bg-gray-100 p-2 rounded-xl transition-all border border-gray-100"
                        >
                            <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                <User size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 hidden sm:inline">My Account</span>
                            <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        navigate(ROUTES.CHANGE_PASSWORD);
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                >
                                    <Key size={16} /> Change Password
                                </button>
                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                    onClick={() => {
                                        setIsDropdownOpen(false);
                                        handleLogout();
                                    }}
                                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size5={16} /> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                {/* Main Content (يتم عرض الصفحات بداخله بناءً على الـ Routing) */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}