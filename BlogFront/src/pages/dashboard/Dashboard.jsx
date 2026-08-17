
import React from 'react';
import { LayoutDashboard, LogOut, Key, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTES } from '../../config/routes';

export default function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await authService.logout();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md p-6 hidden md:block">
                <div className="flex items-center gap-2 mb-10">
                    <LayoutDashboard className="text-indigo-600" />
                    <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
                </div>

                <nav className="space-y-4">
                    <button className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors w-full">
                        <User size={20} /> Profile
                    </button>
                    <button
                        onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
                        className="flex items-center gap-3 text-gray-600 hover:text-indigo-600 transition-colors w-full"
                    >
                        <Key size={20} /> Change Password
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-red-600 hover:text-red-700 transition-colors w-full mt-10"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
                    <p className="text-gray-500">Here is an overview of your account activity.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 mb-2">Total Activity</h3>
                        <p className="text-3xl font-bold text-indigo-600">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 mb-2">Pending Tasks</h3>
                        <p className="text-3xl font-bold text-orange-500">3</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 mb-2">Completed</h3>
                        <p className="text-3xl font-bold text-green-500">9</p>
                    </div>
                </div>
            </main>
        </div>
    );
}