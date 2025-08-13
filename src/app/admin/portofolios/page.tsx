'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/loader';
import NotFound from '@/app/not-found';

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

type FormData = Omit<Portfolio, 'id' | 'createdAt' | 'updatedAt'>;

const initialFormData: FormData = {
    title: '',
    description: '',
    technologies: [],
    category: '',
    imageUrls: [],
    projectUrl: '',
    githubUrl: '',
    isActive: true
};

const predefinedCategories = [
    'Web Development',
    'Mobile Development',
    'Desktop Application',
    'Machine Learning',
    'Data Science',
    'DevOps',
    'UI/UX Design',
    'Game Development'
];

const predefinedTechnologies = [
    'React', 'Next.js', 'Vue.js', 'Angular', 'Svelte',
    'Node.js', 'Express', 'NestJS', 'Django', 'Flask',
    'TypeScript', 'JavaScript', 'Python', 'Java', 'C#',
    'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Firebase',
    'AWS', 'Docker', 'Kubernetes', 'Vercel', 'Netlify',
    'Tailwind CSS', 'Material-UI', 'Bootstrap', 'Sass',
    'React Native', 'Flutter', 'Swift', 'Kotlin',
    'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas'
];

export default function AdminPortfolioPage() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [techInput, setTechInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        const fetchPortfolios = async () => {
            try {
                const res = await fetch('/api/portofolios');
                if (!res.ok) throw new Error('Failed to fetch portfolios');
                const data: Portfolio[] = await res.json();
                setPortfolios(data);
            } catch (error) {
                console.error('Error loading portfolios:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPortfolios();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        try {
            if (editingId) {
                const res = await fetch(`/api/portofolios/${editingId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                
                if (!res.ok) throw new Error('Failed to update portfolio');
                const updatedPortfolio = await res.json();
                
                setPortfolios(prev => prev.map(portfolio => 
                    portfolio.id === editingId ? updatedPortfolio : portfolio
                ));
            } else {
                // Create new portfolio
                const res = await fetch('/api/portofolios', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });
                
                if (!res.ok) throw new Error('Failed to create portfolio');
                const newPortfolio = await res.json();
                
                setPortfolios(prev => [...prev, newPortfolio]);
            }
            
            resetForm();
        } catch (error) {
            console.error('Error saving portfolio:', error);
            alert('Failed to save portfolio. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (portfolio: Portfolio) => {
        setFormData({
            title: portfolio.title,
            description: portfolio.description,
            technologies: portfolio.technologies,
            category: portfolio.category,
            imageUrls: portfolio.imageUrls || [],
            projectUrl: portfolio.projectUrl || '',
            githubUrl: portfolio.githubUrl || '',
            isActive: portfolio.isActive
        });
        setEditingId(portfolio.id);
        setIsFormOpen(true);
    };


    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this portfolio?')) return;
        
        try {
            const res = await fetch(`/api/portofolios/${id}`, {
                method: 'DELETE',
            });
            
            if (!res.ok) throw new Error('Failed to delete portfolio');
            
            setPortfolios(prev => prev.filter(portfolio => portfolio.id !== id));
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            alert('Failed to delete portfolio. Please try again.');
        }
    };

    const toggleStatus = async (id: number) => {
        try {
            const portfolio = portfolios.find(p => p.id === id);
            if (!portfolio) return;
            
            const res = await fetch(`/api/portofolios/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: !portfolio.isActive }),
            });
            
            if (!res.ok) throw new Error('Failed to update status');
            const updatedPortfolio = await res.json();
            
            setPortfolios(prev => prev.map(p => 
                p.id === id ? updatedPortfolio : p
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingId(null);
        setIsFormOpen(false);
        setTechInput('');
    };

    const addTechnology = (tech: string) => {
        if (tech && !formData.technologies.includes(tech)) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, tech]
            }));
        }
        setTechInput('');
    };

    const removeTechnology = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const filteredPortfolios = portfolios.filter(portfolio => {
        const matchesSearch = portfolio.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            portfolio.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || portfolio.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const categories = ['all', ...Array.from(new Set(portfolios.map(p => p.category)))];

    if (process.env.NODE_ENV === "production") {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Portfolio Management</h1>
                        <p className="text-gray-400">Manage your portfolio projects</p>
                    </div>
                    <div className="flex gap-4">
                        <Link 
                            href="/admin"
                            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        >
                            Back to Admin
                        </Link>
                        <button
                            onClick={() => setIsFormOpen(true)}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Add Portfolio
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search portfolios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-blue-400">{portfolios.length}</div>
                        <div className="text-gray-400 text-sm">Total Projects</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-green-400">{portfolios.filter(p => p.isActive).length}</div>
                        <div className="text-gray-400 text-sm">Active Projects</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-yellow-400">{portfolios.filter(p => !p.isActive).length}</div>
                        <div className="text-gray-400 text-sm">Inactive Projects</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-purple-400">{categories.length - 1}</div>
                        <div className="text-gray-400 text-sm">Categories</div>
                    </div>
                </div>

                {/* Portfolio List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader/>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Technologies</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Updated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredPortfolios.map((portfolio) => (
                                        <tr key={portfolio.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 bg-gray-600 rounded-lg flex-shrink-0 mr-4">
                                                        {portfolio.imageUrls?.[0] ? (
                                                        <img 
                                                            src={portfolio.imageUrls[0]} 
                                                            alt={portfolio.title}
                                                            className="h-10 w-10 rounded-lg object-cover"
                                                        />
                                                        ) : (
                                                        <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center">
                                                            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                            </svg>
                                                        </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{portfolio.title}</div>
                                                        <div className="text-sm text-gray-400 truncate max-w-xs">{portfolio.description}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded-full">
                                                    {portfolio.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {portfolio.technologies.slice(0, 3).map((tech, i) => (
                                                        <span key={i} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                                                            {tech}
                                                        </span>
                                                    ))}
                                                    {portfolio.technologies.length > 3 && (
                                                        <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                                                            +{portfolio.technologies.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(portfolio.id)}
                                                    className={`px-3 py-1 text-xs rounded-full ${
                                                        portfolio.isActive
                                                            ? 'bg-green-600 text-green-100'
                                                            : 'bg-red-600 text-red-100'
                                                    }`}
                                                >
                                                    {portfolio.isActive ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {portfolio.updatedAt}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(portfolio)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(portfolio.id)}
                                                        className="text-red-400 hover:text-red-300 p-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {filteredPortfolios.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">No portfolios found</div>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Create your first portfolio
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingId ? 'Edit Portfolio' : 'Add Portfolio'}
                                </h2>
                                <button
                                    onClick={resetForm}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Project Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="Enter project title"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="Describe your project"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select a category</option>
                                        {predefinedCategories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Technologies */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Technologies
                                    </label>
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={techInput}
                                                onChange={(e) => setTechInput(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology(techInput))}
                                                className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                                placeholder="Add technology"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => addTechnology(techInput)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        
                                        {/* Predefined Technologies */}
                                        <div className="flex flex-wrap gap-2">
                                            {predefinedTechnologies.map(tech => (
                                                <button
                                                    key={tech}
                                                    type="button"
                                                    onClick={() => addTechnology(tech)}
                                                    disabled={formData.technologies.includes(tech)}
                                                    className={`px-2 py-1 text-xs rounded ${
                                                        formData.technologies.includes(tech)
                                                            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                    }`}
                                                >
                                                    {tech}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Selected Technologies */}
                                        {formData.technologies.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {formData.technologies.map(tech => (
                                                    <span
                                                        key={tech}
                                                        className="inline-flex items-center px-2 py-1 text-xs bg-blue-600 text-blue-100 rounded"
                                                    >
                                                        {tech}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTechnology(tech)}
                                                            className="ml-1 text-blue-200 hover:text-white"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* URLs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Project URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.projectUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, projectUrl: e.target.value }))}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                            placeholder="https://project-demo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            GitHub URL
                                        </label>
                                        <input
                                            type="url"
                                            value={formData.githubUrl}
                                            onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>
                                </div>

                                {/* Image URLs */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Image URLs
                                    </label>
                                <div className="space-y-2">
                                    {formData.imageUrls.map((url, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => {
                                            const updatedUrls = [...formData.imageUrls];
                                            updatedUrls[index] = e.target.value;
                                            setFormData(prev => ({ ...prev, imageUrls: updatedUrls }));
                                        }}
                                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder={`Image URL ${index + 1}`}
                                        />
                                        <button
                                        type="button"
                                        onClick={() => {
                                            const updatedUrls = formData.imageUrls.filter((_, i) => i !== index);
                                            setFormData(prev => ({ ...prev, imageUrls: updatedUrls }));
                                        }}
                                        className="text-red-400 hover:text-red-300"
                                        >
                                        ×
                                        </button>
                                    </div>
                                    ))}
                                    <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }))}
                                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                    + Add Image URL
                                    </button>
                                </div>
                                </div>

                                {/* Status */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                        className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                                        Make this portfolio active
                                    </label>
                                </div>

                                {/* Form Actions */}
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? 'Saving...' : (editingId ? 'Update Portfolio' : 'Create Portfolio')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}