import React, { useState } from "react";
import Link from "next/link";

type Language = {
    name: string;
    flag: string;
    level: string;
    description: string;
    proficiency: number;
};

const languages: Language[] = [
    {
        name: "Indonesian",
        flag: "🇮🇩",
        level: "Native",
        description: "Born and raised in Indonesia",
        proficiency: 100
    },
    {
        name: "English",
        flag: "🇬🇧",
        level: "Advanced",
        description: "Fluent in academic and conversational English",
        proficiency: 75
    },
    {
        name: "Japanese",
        flag: "🇯🇵",
        level: "Basic",
        description: "Still learning to be better :D",
        proficiency: 20
    },
];

export default function LanguageSection() {
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);

    return (
        <section
            id="languages"
            className="py-8 px-6 md:px-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 transition-colors duration-500"
        >
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {languages.map((lang) => (
                        <Link
                            key={lang.name}
                            href="/portofolio"
                            className="block"
                        >
                            <div
                                onMouseEnter={() => setHoveredCard(lang.name)}
                                onMouseLeave={() => setHoveredCard(null)}
                                className={`
                                    bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg border-2 
                                    cursor-pointer transition-all duration-500 transform group
                                    border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600
                                    ${hoveredCard === lang.name ? 'scale-105 -translate-y-2' : ''}
                                    ${hoveredCard && hoveredCard !== lang.name ? 'opacity-75 scale-95' : ''}
                                `}
                            >
                                <div className="flex items-center mb-4 space-x-4">
                                    <div className={`text-3xl transition-transform duration-300 ${
                                        hoveredCard === lang.name ? 'scale-125 rotate-12' : ''
                                    }`}>
                                        {lang.flag}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                            {lang.name}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {lang.level}
                                        </p>
                                    </div>
                                </div>
                                
                                <p className="text-sm mb-4 text-gray-700 dark:text-gray-300">
                                    {lang.description}
                                </p>
                                
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-1000 ease-out ${
                                            lang.proficiency >= 80 ? 'bg-green-500' :
                                            lang.proficiency >= 50 ? 'bg-blue-500' :
                                            'bg-orange-500'
                                        }`}
                                        style={{ 
                                            width: hoveredCard === lang.name ? `${Math.min(lang.proficiency + 5, 100)}%` : `${lang.proficiency}%`
                                        }}
                                    />
                                </div>
                                <p className="mt-2 text-sm text-right text-gray-600 dark:text-gray-400">
                                    {lang.proficiency}%
                                </p>

                                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0l-4-4m4 4l-4 4" />
                                    </svg>
                                    <span>View Portfolio</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}