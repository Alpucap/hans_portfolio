'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import NotFound from '../not-found';

type Stats = {
    skills: number;
    experiences: number;
    projects: number;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats>({
        skills: 0,
        experiences: 0,
        projects: 0,
    });

    useEffect(() => {
        fetch('/api/stats')
        .then((res) => res.json())
        .then((data) => setStats(data));
    }, []);

    if (process.env.NODE_ENV === "production") {
        return <NotFound />;
    }
    
    return (
        
        <div className="min-h-screen bg-gray-900 text-gray-100 p-20 justify-center items-center">
            
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-white mb-4">Hello Admin!</h1>
                    <p className="text-xl text-gray-400">Manage your portfolio content</p>
                </div>

                {/* Admin Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Skills Management */}
                    <Link href="/admin/skills" className="group">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-700 hover:border-blue-500">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white ml-4">Skills</h3>
                            </div>
                            <p className="text-gray-400 mb-4">Manage your technical skills</p>
                            <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                                <span className="text-sm font-medium">Manage Skills</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Project Management */}
                    <Link href="/admin/portofolios" className="group">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-700 hover:border-blue-500">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white ml-4">Projects</h3>
                            </div>
                            <p className="text-gray-400 mb-4">Manage your portfolio projects</p>
                            <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                                <span className="text-sm font-medium">Manage Projects</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    <Link href="/admin/experiences" className="group">
                        <div className="bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-700 hover:border-blue-500">
                            <div className="flex items-center mb-4">
                                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-500 transition-colors duration-200">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-white ml-4">Experiences</h3>
                            </div>
                            <p className="text-gray-400 mb-4">Manage your experiences</p>
                            <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors duration-200">
                                <span className="text-sm font-medium">Manage Experiences</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mt-12 grid md:grid-cols-3 gap-6">
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="text-3xl font-bold text-blue-400 mb-2">{stats.skills}</div>
                        <div className="text-gray-400 text-sm">Total Skills</div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="text-3xl font-bold text-green-400 mb-2">{stats.projects}</div>
                        <div className="text-gray-400 text-sm">Projects</div>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="text-3xl font-bold text-purple-400 mb-2">{stats.experiences}</div>
                        <div className="text-gray-400 text-sm">Experiences</div>
                    </div>
                </div>

                {/* Back to Homepage */}
                <div className="mt-12">
                    <Link 
                        href="/"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Homepage
                    </Link>
                </div>
                
            </div>
        </div>
    );
}