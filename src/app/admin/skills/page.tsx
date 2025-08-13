'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/loader';
import NotFound from '@/app/not-found';

// Skill's Model
type Skill = {
    id: number;
    title: string;
    skills: string;
    link: string | null;
};

type FormData = {
    title: string;
    skills: string;
    link: string;
};

const initialFormData: FormData = {
    title: '',
    skills: '',
    link: '',
};

export default function AdminSkills() {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [searchTerm, setSearchTerm] = useState('');
    
    const fetchSkills = async () => {
        try {
            const response = await fetch('/api/skills');
            const data = await response.json();
            setSkills(data);
        } catch (error) {
            console.error('Error fetching skills:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingSkill ? `/api/skills/${editingSkill.id}` : '/api/skills';
            const method = editingSkill ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchSkills();
                resetForm();
                alert(editingSkill ? 'Skill updated successfully!' : 'Skill created successfully!');
            } else {
                alert('Error saving skill');
            }
        } catch (error) {
            console.error('Error saving skill:', error);
            alert('Error saving skill');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            const response = await fetch(`/api/skills/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchSkills();
                alert('Skill deleted successfully!');
            } else {
                alert('Error deleting skill');
            }
        } catch (error) {
            console.error('Error deleting skill:', error);
            alert('Error deleting skill');
        }
    };

    const handleEdit = (skill: Skill) => {
        setEditingSkill(skill);
        setFormData({
            title: skill.title,
            skills: skill.skills,
            link: skill.link || '',
        });
        setIsFormOpen(true);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setEditingSkill(null);
        setIsFormOpen(false);
    };

    const filteredSkills = skills.filter(skill => 
        skill.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        skill.skills.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (process.env.NODE_ENV === "production") {
        return <NotFound />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2">Skills Management</h1>
                        <p className="text-gray-400">Manage your portfolio skills</p>
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
                            Add Skill
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search skills..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-blue-400">{skills.length}</div>
                        <div className="text-gray-400 text-sm">Total Skills</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-green-400">{skills.filter(s => s.link).length}</div>
                        <div className="text-gray-400 text-sm">With Links</div>
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                        <div className="text-2xl font-bold text-yellow-400">{skills.filter(s => !s.link).length}</div>
                        <div className="text-gray-400 text-sm">Without Links</div>
                    </div>
                </div>

                {/* Skills List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader/>
                    </div>
                ) : (
                    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Title</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Skills</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Link</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                    {filteredSkills.map((skill) => (
                                        <tr key={skill.id} className="hover:bg-gray-750">
                                            <td className="px-6 py-4 text-sm text-gray-400">{skill.id}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-white">{skill.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-gray-300 max-w-xs truncate">{skill.skills}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {skill.link ? (
                                                    <a 
                                                        href={skill.link} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-400 hover:text-blue-300 underline text-sm"
                                                    >
                                                        View Link
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-500 italic text-sm">No link</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(skill)}
                                                        className="text-blue-400 hover:text-blue-300 p-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(skill.id)}
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
                        
                        {filteredSkills.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-gray-400 mb-2">No skills found</div>
                                <button
                                    onClick={() => setIsFormOpen(true)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    Create your first skill
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="e.g., Frontend Development"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Skills Description *
                                    </label>
                                    <textarea
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="Describe your skills..."
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Link (optional)
                                    </label>
                                    <input
                                        type="url"
                                        value={formData.link}
                                        onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                                        placeholder="https://example.com"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Saving...' : editingSkill ? 'Update Skill' : 'Create Skill'}
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