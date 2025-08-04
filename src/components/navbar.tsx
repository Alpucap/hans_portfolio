'use client';

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
    const [scrollY, setScrollY] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setScrollY(window.scrollY);
            });
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleNavClick = (item: string) => {
        const element = document.getElementById(item.toLowerCase());
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                backgroundColor:
                    scrollY > 50 ? "rgba(17, 24, 39, 0.95)" : "transparent", 
                backdropFilter: scrollY > 50 ? "blur(10px)" : "none",
                borderBottom: scrollY > 50 ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
            }}
        >
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link href="/" passHref>
                    <span
                        className={`text-2xl font-bold cursor-pointer transition-colors duration-300 ${
                        scrollY > 50 ? "text-blue-400" : "text-white"
                        }`}
                    >
                        HCH
                    </span>
                    </Link>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        {["About", "Projects", "Experiences", "Contact"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(item);
                                }}
                                className={`text-sm font-medium transition-all duration-300 ${
                                    scrollY > 50 
                                        ? "text-gray-300 hover:text-blue-400" 
                                        : "text-gray-200 hover:text-white"
                                } relative group`}
                            >
                                {item}
                                <span className={`absolute left-0 -bottom-1 h-0.5 bg-blue-400 transition-all duration-300 ${
                                    scrollY > 50 ? "w-0 group-hover:w-full" : "w-0"
                                }`}></span>
                            </a>
                        ))}
                    </div>
                    
                    {/* Hamburger Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className={`md:hidden p-2 transition-all duration-300 ${
                            scrollY > 50 ? "text-blue-400" : "text-white"
                        }`}
                        aria-label="Toggle mobile menu"
                    >
                        <svg 
                            className={`w-6 h-6 transition-transform duration-300 ${
                                isMobileMenuOpen ? 'rotate-90' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
                
                {/* Mobile Menu */}
                <div className={`md:hidden transition-all duration-300 overflow-hidden ${
                    isMobileMenuOpen 
                        ? 'max-h-64 opacity-100 mt-4' 
                        : 'max-h-0 opacity-0'
                }`}>
                    <div className="py-2 space-y-2">
                        {["About", "Projects", "Experiences", "Contact"].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleNavClick(item);
                                }}
                                className={`block px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${
                                    scrollY > 50 
                                        ? "text-gray-300 hover:text-blue-400 hover:bg-gray-800" 
                                        : "text-gray-200 hover:text-white hover:bg-white hover:bg-opacity-10"
                                }`}
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}