'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import LiquidMorphLoader from '@/components/loader';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

import { Navigation, Autoplay } from 'swiper/modules';

type Portfolio = {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    category: string;
    imageUrls: string[];
    projectUrl?: string;
    githubUrl?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

type Category = {
    id: string;
    name: string;
    count: number;
};

export default function PortfolioPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [filteredPortfolios, setFilteredPortfolios] = useState<Portfolio[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [scrollY, setScrollY] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

    useEffect(() => {
        fetchPortfolios();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => setScrollY(window.scrollY));
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchPortfolios = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            console.log('Fetching portfolios from API...');
            
            const response = await fetch('/api/portofolios', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                cache: 'no-store'
            });
            
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('API Error:', errorText);
                throw new Error(`Failed to fetch portfolios: ${response.status} ${response.statusText}`);
            }
            
            const data: Portfolio[] = await response.json();
            console.log('Fetched portfolios:', data);
            
            // Filter only active portfolios for public view
            const activePortfolios = data.filter(portfolio => portfolio.isActive);
            console.log('Active portfolios:', activePortfolios);
            
            setPortfolios(activePortfolios);
            setFilteredPortfolios(activePortfolios);
            
            const categoryMap = new Map<string, number>();
            activePortfolios.forEach((portfolio) => {
                categoryMap.set(portfolio.category, (categoryMap.get(portfolio.category) || 0) + 1);
            });
            
            const categoriesData: Category[] = [
                { id: 'all', name: 'All Projects', count: activePortfolios.length },
                ...Array.from(categoryMap.entries()).map(([category, count]) => ({
                    id: category.toLowerCase().replace(/\s+/g, '-'),
                    name: category,
                    count
                }))
            ];
            
            setCategories(categoriesData);
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load portfolios');
        } finally {
            setIsLoading(false);
        }
    };

    const filterPortfolios = (categoryId: string) => {
        setActiveCategory(categoryId);
        setExpandedCards(new Set()); // Reset expanded cards when filtering
        if (categoryId === 'all') {
            setFilteredPortfolios(portfolios);
        } else {
            const categoryName = categories.find(cat => cat.id === categoryId)?.name;
            const filtered = portfolios.filter(portfolio => 
                portfolio.category.toLowerCase() === categoryName?.toLowerCase()
            );
            setFilteredPortfolios(filtered);
        }
    };

    const toggleDescription = (portfolioId: number) => {
        setExpandedCards(prev => {
            const newSet = new Set(prev);
            if (newSet.has(portfolioId)) {
                newSet.delete(portfolioId);
            } else {
                newSet.add(portfolioId);
            }
            return newSet;
        });
    };

    const videoParallax = scrollY * 0.8;
    const textParallax = scrollY * 0.4;
    const overlayOpacity = Math.min(0.6, scrollY / 800);

    if (error) {
        return (
            <div className="bg-gray-900 text-gray-100 min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="text-6xl text-red-500 mb-4">Sorry 😔</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
                    <p className="text-gray-400 mb-6 text-sm">{error}</p>
                    <div className="space-y-3">
                        <button
                            onClick={fetchPortfolios}
                            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            Try Again
                        </button>
                        <button
                            onClick={() => {
                                setError(null);
                                setIsLoading(false);
                                setPortfolios([]);
                                setFilteredPortfolios([]);
                            }}
                            className="w-full px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Continue Without Data
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                            My Portfolio
                        </h1>
                        <p
                            className="text-2xl md:text-3xl font-light tracking-wide text-gray-300"
                            style={{ transform: `translate3d(0, ${scrollY * 0.6}px, 0)` }}
                        >
                            Explore my journey through innovative and creative projects
                        </p>
                    </div>
                </div>

                <div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 text-white-300 animate-bounce"
                    style={{ opacity: Math.max(0, 1 - scrollY / 300) }}
                >
                    <div className="flex flex-col items-center space-y-2">
                        <span className="text-sm font-light tracking-wider">EXPLORE PROJECTS</span>
                        <div className="w-px h-12 bg-white opacity-60" />
                    </div>
                </div>
            </div>

            {/* Portfolio Content */}
            <div
                className="relative z-30 bg-gradient-to-br from-gray-800 to-gray-900 will-change-transform"
                style={{ transform: `translate3d(0, ${Math.max(-100, -scrollY * 0.1)}px, 0)` }}
            >
                <div className="min-h-screen px-3 py-32">
                    <div className="max-w-7xl mx-auto">
                        
                        {!isLoading && categories.length > 1 && (
                            <div 
                                className="mb-20 will-change-transform"
                                style={{
                                    transform: `translate3d(0, ${Math.max(0, (800 - scrollY) * 0.1)}px, 0)`,
                                    opacity: Math.min(1, Math.max(0, (scrollY - 200) / 300)),
                                }}
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Project Categories</h2>
                                    <div className="w-20 h-1 bg-blue-400 mx-auto mb-8"></div>
                                </div>
                                <div className="flex flex-wrap justify-center gap-6">
                                    {categories.map((category) => (
                                        <button
                                            key={category.id}
                                            onClick={() => filterPortfolios(category.id)}
                                            className={`px-8 py-4 rounded-2xl font-medium transition-all duration-500 hover:-translate-y-2 hover:scale-105 border ${
                                                activeCategory === category.id
                                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25 border-blue-500'
                                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border-gray-700'
                                            }`}
                                        >
                                            <div className="text-lg font-bold">{category.name}</div>
                                            <div className="text-sm opacity-75">({category.count} projects)</div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col justify-center items-center min-h-[50vh]">
                                <LiquidMorphLoader 
                                    size="lg" 
                                    color="blue" 
                                    speed="normal"
                                    className="mb-6"
                                />
                                <p className="text-xl text-gray-400 animate-pulse">Loading amazing projects...</p>
                            </div>
                        )}

                        {/* Portfolio Grid */}
                        {!isLoading && filteredPortfolios.length > 0 && (
                            <div
                                className="will-change-transform"
                                style={{
                                    opacity: Math.min(1, Math.max(0, (scrollY - 400) / 400)),
                                }}
                            >
                                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {filteredPortfolios.map((portfolio, index) => {
                                        const isExpanded = expandedCards.has(portfolio.id);
                                        const shouldShowReadMore = portfolio.description.length > 120;
                                        
                                        return (
                                            <div
                                                key={portfolio.id}
                                                className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 border border-gray-700/50 hover:border-blue-500/30 transform hover:-translate-y-2 hover:scale-[1.02]"
                                                style={{
                                                    animation: `fadeInUp 0.6s ease-out ${index * 100}ms both`,
                                                }}
                                            >
                                                {/* Portfolio Image */}
                                                <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-800 overflow-hidden">
                                                    {portfolio.imageUrls && portfolio.imageUrls.length > 0 ? (
                                                        <>
                                                            <Swiper
                                                                modules={[Navigation, Autoplay]}
                                                                navigation={{
                                                                    nextEl: `.swiper-button-next-${portfolio.id}`,
                                                                    prevEl: `.swiper-button-prev-${portfolio.id}`,
                                                                }}
                                                                autoplay={{
                                                                    delay: 3000,
                                                                    disableOnInteraction: false,
                                                                    pauseOnMouseEnter: true,
                                                                }}
                                                                spaceBetween={10}
                                                                slidesPerView={1}
                                                                loop={portfolio.imageUrls.length > 1}
                                                                className="h-full w-full custom-swiper"
                                                            >
                                                                {portfolio.imageUrls.map((url, index) => (
                                                                    <SwiperSlide key={index}>
                                                                        <img
                                                                            src={url}
                                                                            alt={`${portfolio.title} - image ${index + 1}`}
                                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                                const next = e.currentTarget.nextElementSibling as HTMLElement;
                                                                                if (next) next.classList.remove('hidden');
                                                                            }}
                                                                        />
                                                                    </SwiperSlide>
                                                                ))}
                                                            </Swiper>

                                                            {/* Custom Navigation Arrows */}
                                                            {portfolio.imageUrls.length > 1 && (
                                                                <>
                                                                    <div className={`swiper-button-prev-${portfolio.id} absolute left-2 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110`}>
                                                                        <div className="w-6 h-6 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/90 transition-all duration-300 shadow-lg">
                                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className={`swiper-button-next-${portfolio.id} absolute right-2 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110`}>
                                                                        <div className="w-6 h-6 bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/90 transition-all duration-300 shadow-lg">
                                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                                                            </svg>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                                                            <div className="text-gray-500">
                                                                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Enhanced overlay with links */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                                                        {portfolio.projectUrl && (
                                                            <Link
                                                                href={portfolio.projectUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-blue-500/90 backdrop-blur-sm rounded-full text-white hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-blue-500/50"
                                                                title="View Live Project"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        {portfolio.githubUrl && (
                                                            <Link
                                                                href={portfolio.githubUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-2 bg-gray-700/90 backdrop-blur-sm rounded-full text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 shadow-xl hover:shadow-gray-500/50"
                                                                title="View Source Code"
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                    </div>

                                                    <div className="absolute top-3 right-3 z-10">
                                                        <span className="px-2 py-1 text-xs font-medium bg-blue-500/90 backdrop-blur-sm text-white rounded-full shadow-lg">
                                                            {portfolio.category}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-4 flex flex-col min-h-[240px]">
                                                    <div className="mb-3">
                                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 leading-tight line-clamp-2 mb-1">
                                                            {portfolio.title}
                                                        </h3>
                                                    </div>
                                                    
                                                    <div className="flex-1 mb-3">
                                                        <div className="relative">
                                                            <p className={`text-gray-300 text-sm leading-relaxed transition-all duration-300 ${
                                                                isExpanded ? '' : 'line-clamp-3'
                                                            }`}>
                                                                {portfolio.description}
                                                            </p>
                                                            
                                                            {shouldShowReadMore && (
                                                                <div className="mt-2">
                                                                    <button 
                                                                        className="text-blue-400 hover:text-blue-300 font-medium text-xs cursor-pointer transition-colors duration-200 hover:underline"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            toggleDescription(portfolio.id);
                                                                        }}
                                                                    >
                                                                        {isExpanded ? 'Show less' : 'Read more'}
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <div className="flex flex-wrap gap-1">
                                                            {portfolio.technologies.slice(0, 2).map((tech, i) => (
                                                                <span
                                                                    key={i}
                                                                    className="px-2 py-1 text-xs font-medium bg-gray-700/80 text-blue-300 rounded-lg hover:bg-gray-600/80 transition-colors duration-200"
                                                                >
                                                                    {tech}
                                                                </span>
                                                            ))}
                                                            {portfolio.technologies.length > 2 && (
                                                                <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-lg">
                                                                    +{portfolio.technologies.length - 2}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="pt-2 border-t border-gray-700/50 mt-auto">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-400 font-medium">
                                                                {new Date(portfolio.updatedAt).toLocaleDateString('en-US', {
                                                                    year: 'numeric',
                                                                    month: 'short'
                                                                })}
                                                            </span>
                                                            <div className="flex gap-1">
                                                                {portfolio.projectUrl && (
                                                                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" title="Live Demo Available"></div>
                                                                )}
                                                                {portfolio.githubUrl && (
                                                                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" title="Source Code Available"></div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {!isLoading && filteredPortfolios.length === 0 && portfolios.length === 0 && (
                            <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center">
                                <div className="text-8xl text-gray-600 mb-8">🚀</div>
                                <h3 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Portfolio Coming Soon</h3>
                                <div className="w-20 h-1 bg-blue-400 mx-auto mb-8"></div>
                                <p className="text-xl text-gray-300 leading-relaxed mb-12 max-w-2xl mx-auto">
                                    I am working on some amazing projects that will be showcased here soon. 
                                    Stay tuned for updates!
                                </p>
                                <Link 
                                    href="#contact"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all duration-500 shadow-lg shadow-blue-500/25"
                                >
                                    Get In Touch
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        )}

                        {!isLoading && filteredPortfolios.length === 0 && portfolios.length > 0 && (
                            <div className="text-center py-20 min-h-[50vh] flex flex-col justify-center">
                                <div className="text-8xl text-gray-600 mb-8">🔍</div>
                                <h3 className="text-4xl font-bold text-white mb-4 tracking-tight">No Projects Found</h3>
                                <div className="w-20 h-1 bg-blue-400 mx-auto mb-8"></div>
                                <p className="text-xl text-gray-300 mb-12">
                                    No projects match the selected category. Try selecting a different category.
                                </p>
                                <button
                                    onClick={() => filterPortfolios('all')}
                                    className="px-8 py-4 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-all duration-500 border border-gray-700 shadow-lg"
                                >
                                    Show All Projects
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
                            Interested in Working Together?
                        </h2>
                        <div className="w-20 h-1 bg-blue-500 mx-auto mb-8"></div>
                        <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                            I am always excited to collaborate on innovative projects and bring creative ideas to life.
                            Lets create something amazing together.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-8 justify-center">
                            <Link 
                                href="#contact"
                                className="px-8 py-4 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-500 hover:scale-105 shadow-lg shadow-blue-500/25"
                            >
                                Get In Touch
                            </Link>
                            <Link 
                                href="/"
                                className="px-8 py-4 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-all duration-500 hover:scale-105 border border-gray-700 shadow-lg"
                            >
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}