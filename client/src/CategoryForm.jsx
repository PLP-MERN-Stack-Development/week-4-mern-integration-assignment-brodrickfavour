// src/CategoryForm.jsx
import React, { useState, useContext } from 'react';
import { ApiContext } from './App';
import { useApi } from './hooks/useApi';
import { RouterContext } from './Router';

export const CategoryForm = () => {
    const { baseUrl } = useContext(ApiContext);
    const { loading, error, fetchData } = useApi(baseUrl);
    const { navigate } = useContext(RouterContext);

    const [name, setName] = useState('');
    const [formError, setFormError] = useState('');
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        setSubmissionSuccess(false);

        if (!name.trim()) {
            setFormError('Category name is required.');
            return;
        }
        if (name.trim().length < 2) {
            setFormError('Category name must be at least 2 characters long.');
            return;
        }

        try {
            await fetchData('/api/categories', {
                method: 'POST',
                body: JSON.stringify({ name }),
            });
            setSubmissionSuccess(true);
            setName(''); // Clear form
            alert('Category created successfully!');
            navigate('/'); // Navigate to home after creation
        } catch (err) {
            setFormError(err.message);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Category</h1>
            {formError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{formError}</div>}
            {submissionSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">Category created!</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="categoryName" className="block text-gray-700 text-sm font-bold mb-2">Category Name:</label>
                    <input
                        type="text"
                        id="categoryName"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formError ? 'border-red-500' : ''}`}
                        placeholder="e.g., Technology, Lifestyle"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Category'}
                </button>
            </form>
        </div>
    );
};

