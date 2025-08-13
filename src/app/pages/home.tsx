'use client';

import LanguageSection from '@/components/language';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Skill = {
    id: number;
    title: string;
    skills: string;
    link: string;
};

type ExperienceType = {
    id: number;
    title: string;
    company: string;
    startDate: string;
    description: string;
    tools: string[];
    isActive: boolean;
    order: number | null;
    createdAt: string;
    updatedAt: string;
};

export default function Home() {
    const [scrollY, setScrollY] = useState(0);
    const [skills, setSkills] = useState<Skill[]>([]);
    const [experiences, setExperiences] = useState<ExperienceType[]>([]);
    const notfound = false;
    
    if (notfound) {
        notFound()
    }

    useEffect(() => {
        const handleScroll = () => {
        requestAnimationFrame(() => setScrollY(window.scrollY));
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch('/api/skills')
        .then((res) => res.json())
        .then((data) => setSkills(data));

        fetch('/api/experiences')
        .then((res) => res.json())
        .then((data) => setExperiences(data));
    }, []);

    const videoParallax = scrollY * 0.8;
    const textParallax = scrollY * 0.4;
    const overlayOpacity = Math.min(0.6, scrollY / 800);

    return (
        <div className="bg-gray-900 text-gray-100">
            {/* Hero Section */}
            <div className="relative h-screen w-full overflow-hidden bg-gray-900">
                <div
                className="absolute top-0 left-0 w-full h-[140vh] will-change-transform"
                style={{ transform: `translate3d(0, ${videoParallax}px, 0)` }}
                >
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover scale-110 opacity-70"
                    onError={(e) => {
                    console.log('Video failed to load:', e);
                    (e.target as HTMLVideoElement).style.display = 'none';
                    }}
                >
                    <source src="./videos/forest.mp4" type="video/mp4" />
                </video>
                </div>

                <div
                className="absolute top-0 left-0 w-full h-full bg-gray-900 z-10 transition-opacity duration-300"
                style={{ opacity: 0.5 + overlayOpacity }}
                />

                <div
                className="relative z-20 flex items-center justify-center h-full will-change-transform"
                style={{
                    transform: `translate3d(0, ${textParallax}px, 0)`,
                    opacity: Math.max(0, 1 - scrollY / 600),
                }}
                >
                <div className="text-center text-white px-4">
                    <h1
                    className="text-6xl md:text-8xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r text-white"
                    style={{ transform: `translate3d(0, ${scrollY * 0.2}px, 0)` }}
                    >
                    Hans Christian Handoto
                    </h1>
                    <p
                    className="text-2xl md:text-3xl font-light tracking-wide text-gray-300"
                    style={{ transform: `translate3d(0, ${scrollY * 0.6}px, 0)` }}
                    >
                    Undergraduate Informatics Engineering Student
                    </p>
                </div>
                </div>

                <div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 text-white-300 animate-bounce"
                style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
                >
                <div className="flex flex-col items-center space-y-2">
                    <span className="text-sm font-light tracking-wider">FIND MORE</span>
                    <div className="w-px h-12 bg-white opacity-60" />
                </div>
                </div>
            </div>

            {/* About & Skills Section */}
            <div
                id="about" className="relative z-30 bg-gradient-to-br from-gray-800 to-gray-900 will-change-transform"
                style={{ transform: `translate3d(0, ${Math.max(-100, -scrollY * 0.1)}px, 0)` }}
            >
                <div className="min-h-screen px-3 py-32">
                    <div className="max-w-7xl mx-auto">
                        {/* About Section */}
                        <div
                        className="text-center mb-20 will-change-transform"
                        style={{
                            transform: `translate3d(0, ${Math.max(0, (800 - scrollY) * 0.1)}px, 0)`,
                            opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)),
                        }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">About Me</h2>
                            <div className="w-20 h-1 bg-blue-400 mx-auto mb-8"></div>
                            <p className="text-xl md:text-xl text-gray-300 leading-relaxed max-w-5xl mx-auto">
                                I am an Informatics Engineering student at Universitas Tarumanagara and have worked as a lecturer
                                assistant, specializing in guiding students through Java-based data structures. I possess strong skills in
                                problem-solving, creative thinking, leadership, and teamwork. Passionate about UI/UX design, web
                                development, and app development, I am eager to leverage my expertise to make meaningful
                                contributions. With a deep enthusiasm for technology and design, I am committed to advancing technological
                                innovation and progress on a global scale.
                            </p>
                        </div>
                        {/* Language Section */}
                        <div id="projects">
                            <LanguageSection />
                        </div>
                        {/* Skills Section */}
                        <div className="grid md:grid-cols-4 gap-12">
                            {skills.map((item) =>
                            item.link ? (
                                <Link href={item.link} key={item.id} className="block">
                                <div className="p-8 bg-gray-900 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-gray-700">
                                    <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">{item.title}</h3>
                                    <p className="text-gray-300 text-lg">{item.skills}</p>
                                </div>
                                </Link>
                            ) : (
                                <div
                                key={item.id}
                                className="p-8 bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-105 border border-gray-700"
                                >
                                <h3 className="text-2xl font-bold text-blue-400 mb-4 text-center">{item.title}</h3>
                                <p className="text-gray-300 text-lg">{item.skills}</p>
                                </div>
                            )
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Experience Section */}
            <div
                id="experiences" className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-16"
                style={{ opacity: Math.min(1, Math.max(0, (scrollY - 1000) / 400)) }}
            >
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">My Experience</h2>
                        <div className="w-20 h-1 bg-blue-500 mx-auto"></div>
                    </div>

                    <div className="max-w-6xl mx-auto">
                        {experiences
                        .sort((a, b) => (b.order ?? 0) - (a.order ?? 0))
                        .map((exp) => (
                            <div key={exp.id} className="relative pl-8 sm:pl-32 py-6 group">
                            <div className="flex flex-col sm:flex-row items-start mb-1 group-last:before:hidden before:absolute before:left-2 sm:before:left-0 before:h-full before:px-px before:bg-gray-700 sm:before:ml-[6.5rem] before:self-start before:-translate-x-1/2 before:translate-y-3 after:absolute after:left-2 sm:after:left-0 after:w-4 after:h-4 after:bg-blue-500 after:rounded-full sm:after:ml-[6.5rem] after:-translate-x-1/2 after:translate-y-1.5">
                                <time className="sm:absolute md:absolute left-0 translate-x-0 lg:translate-x-[-3.5rem] md:translate-x[-1.5rem] inline-flex items-center justify-center text-xs font-semibold uppercase w-36 h-8 mb-3 sm:mb-0 text-blue-500 bg-blue-500/10 rounded-full overflow-hidden px-2 truncate">
                                    {exp.startDate}
                                </time>
                                <div className="text-xl font-bold text-white">{exp.title}</div>
                            </div>
                            <div className="text-blue-400 font-medium mb-2">{exp.company}</div>
                                <p className="text-gray-300">{exp.description}</p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {exp.tools.map((tool, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 text-xs bg-gray-800 text-blue-300 rounded-full"
                                    >
                                        {tool}
                                    </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            
        </div>
    );
}
