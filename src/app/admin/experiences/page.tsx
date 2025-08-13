'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/loader';
import NotFound from '@/app/not-found';

// Experience Model
type Experience = {
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

export default function AdminExperience() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        startDate: '',
        description: '',
        tools: '',
        isActive: false,
        order: ''
    });

    const fetchExperiences = async () => {
        try {
            const response = await fetch('/api/experiences');
            const data = await response.json();
            setExperiences(data);
        } catch (error) {
            console.error('Error fetching experiences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExperiences();
    }, []);

    // Form submission add or update
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingExperience ? `/api/experiences/${editingExperience.id}` : '/api/experiences';
            const method = editingExperience ? 'PUT' : 'POST';

            // Convert tools string to array
            const toolsArray = formData.tools.split(',').map(tool => tool.trim()).filter(tool => tool);
            
            const payload = {
                ...formData,
                tools: toolsArray,
                order: formData.order ? parseInt(formData.order) : null
            };

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                await fetchExperiences();
                resetForm();
                alert(editingExperience ? 'Experience updated successfully!' : 'Experience created successfully!');
            } else {
                alert('Error saving experience');
            }
        } catch (error) {
            console.error('Error saving experience:', error);
            alert('Error saving experience');
        } finally {
            setLoading(false);
        }
    };

    // Delete Experience
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const response = await fetch(`/api/experiences/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchExperiences();
                alert('Experience deleted successfully!');
            } else {
                alert('Error deleting experience');
            }
        } catch (error) {
            console.error('Error deleting experience:', error);
            alert('Error deleting experience');
        }
    };

    // Edit Experience
    const handleEdit = (experience: Experience) => {
        setEditingExperience(experience);
        setFormData({
            title: experience.title,
            company: experience.company,
            startDate: experience.startDate,
            description: experience.description,
            tools: experience.tools.join(', '),
            isActive: experience.isActive,
            order: experience.order?.toString() || ''
        });
        setIsFormOpen(true);
    };

    // Toggle Status
    const toggleStatus = async (id: number) => {
        try {
            const experience = experiences.find(e => e.id === id);
            if (!experience) return;
            
            const response = await fetch(`/api/experiences/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: !experience.isActive }),
            });
            
            if (response.ok) {
                const updatedExperience = await response.json();
                setExperiences(prev => prev.map(e => 
                    e.id === id ? updatedExperience : e
                ));
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status. Please try again.');
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            title: '',
            company: '',
            startDate: '',
            description: '',
            tools: '',
            isActive: false,
            order: ''
        });
        setEditingExperience(null);
        setIsFormOpen(false);
    };

    // Filter experiences
    const filteredExperiences = experiences.filter(experience => {
        const matchesSearch = experience.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            experience.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            experience.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || 
                            (filterStatus === 'active' && experience.isActive) ||
                            (filterStatus === 'inactive' && !experience.isActive);
        return matchesSearch && matchesStatus;
    });

    const statusOptions = ['all', 'active', 'inactive'];

    if (process.env.NODE_ENV === "production") {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Experience Management</h1>
                        <p className="text-gray-400">Manage your work experience and timeline</p>
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
                            Add Experience
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <input
                            type="text"
                            placeholder="Search experiences..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                        {statusOptions.map(status => (
                            <option key={status} value={status}>
                                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-blue-400">{experiences.length}</div>
                        <div className="text-gray-400 text-sm">Total Experiences</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-green-400">{experiences.filter(e => e.isActive).length}</div>
                        <div className="text-gray-400 text-sm">Active Positions</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-yellow-400">{experiences.filter(e => !e.isActive).length}</div>
                        <div className="text-gray-400 text-sm">Past Positions</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-purple-400">{Array.from(new Set(experiences.map(e => e.company))).length}</div>
                        <div className="text-gray-400 text-sm">Companies</div>
                    </div>
                </div>

                {/* Experience List */}
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Position</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Period</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Tools</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Updated</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredExperiences.map((experience) => (
                                        <tr key={experience.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-white">{experience.title}</div>
                                                    <div className="text-sm text-gray-400 truncate max-w-xs">{experience.description}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">{experience.company}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300">{experience.startDate}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1 max-w-xs">
                                                    {experience.tools.slice(0, 3).map((tool, i) => (
                                                        <span key={i} className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                                                            {tool}
                                                        </span>
                                                    ))}
                                                    {experience.tools.length > 3 && (
                                                        <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                                                            +{experience.tools.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => toggleStatus(experience.id)}
                                                    className={`px-3 py-1 text-xs rounded-full ${
                                                        experience.isActive
                                                            ? 'bg-green-600 text-green-100'
                                                            : 'bg-red-600 text-red-100'
                                                    }`}
                                                >
                                                    {experience.isActive ? 'Active' : 'Past'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {experience.updatedAt}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(experience)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(experience.id)}
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
                        
                        {filteredExperiences.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">No experiences found</div>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Add your first experience
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
                                    {editingExperience ? 'Edit Experience' : 'Add Experience'}
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
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Job Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                            placeholder="e.g., Senior Frontend Developer"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Company *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                            placeholder="e.g., Tech Company"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Start Date *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                            placeholder="e.g., Jan 2023 - Present"
                                            required
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                            placeholder="Display order (optional)"
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="Describe your role and achievements..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Tools & Technologies *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tools}
                                        onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., React, Node.js, TypeScript (comma separated)"
                                        required
                                    />
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="isActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="isActive" className="ml-2 text-sm text-gray-300">
                                        Currently Active Position
                                    </label>
                                </div>
                                
                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : (editingExperience ? 'Update Experience' : 'Create Experience')}
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