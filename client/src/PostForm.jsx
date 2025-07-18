// src/PostForm.jsx
import React, { useState, useEffect, useContext } from 'react';
import { ApiContext } from './App';
import { useApi } from './hooks/useApi';
import { RouterContext } from './Router';

export const PostForm = ({ postId }) => {
    const { baseUrl } = useContext(ApiContext);
    const { data: categories, loading: categoriesLoading, error: categoriesError, fetchData: fetchCategories } = useApi(baseUrl);
    const { data: currentPost, loading: postLoading, error: postError, fetchData: fetchPost } = useApi(baseUrl);
    const { loading: submitLoading, error: submitError, fetchData: submitPost } = useApi(baseUrl);
    const { navigate } = useContext(RouterContext);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState(''); // Stores category ID
    const [formErrors, setFormErrors] = useState({});
    const [submissionSuccess, setSubmissionSuccess] = useState(false);

    const isEditMode = !!postId;

    useEffect(() => {
        fetchCategories('/api/categories');
    }, [fetchCategories]);

    useEffect(() => {
        if (isEditMode && postId) {
            fetchPost(`/api/posts/${postId}`);
        } else {
            // Reset form for create mode
            setTitle('');
            setContent('');
            setAuthor('');
            setCategory('');
            setFormErrors({});
            setSubmissionSuccess(false);
        }
    }, [isEditMode, postId, fetchPost]);

    useEffect(() => {
        if (isEditMode && currentPost) {
            setTitle(currentPost.title || '');
            setContent(currentPost.content || '');
            setAuthor(currentPost.author || '');
            setCategory(currentPost.category?._id || ''); // Set category ID from populated object
        }
    }, [isEditMode, currentPost]);

    const validateForm = () => {
        const errors = {};
        if (!title.trim()) errors.title = 'Title is required';
        if (title.trim().length < 3) errors.title = 'Title must be at least 3 characters long';
        if (!content.trim()) errors.content = 'Content is required';
        if (content.trim().length < 10) errors.content = 'Content must be at least 10 characters long';
        if (!author.trim()) errors.author = 'Author is required';
        if (author.trim().length < 2) errors.author = 'Author name must be at least 2 characters long';
        if (!category) errors.category = 'Category is required';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmissionSuccess(false);
        if (!validateForm()) {
            return;
        }

        const postData = { title, content, author, category };
        try {
            if (isEditMode) {
                await submitPost(`/api/posts/${postId}`, {
                    method: 'PUT',
                    body: JSON.stringify(postData),
                });
                setSubmissionSuccess(true);
                alert('Post updated successfully!');
                navigate(`/posts/${postId}`); // Go to the updated post
            } else {
                await submitPost('/api/posts', {
                    method: 'POST',
                    body: JSON.stringify(postData),
                });
                setSubmissionSuccess(true);
                alert('Post created successfully!');
                // Clear form after successful creation
                setTitle('');
                setContent('');
                setAuthor('');
                setCategory('');
                setFormErrors({}); // Clear validation errors
                navigate('/'); // Go back to post list
            }
        } catch (err) {
            // Error handling is done by useApi, but we can display a more specific message here
            setFormErrors({ api: err.message });
        }
    };

    if (categoriesLoading || (isEditMode && postLoading)) return <div className="text-center text-lg text-gray-700">Loading form...</div>;
    if (categoriesError) return <div className="text-center text-lg text-red-600">Error loading categories: {categoriesError}</div>;
    if (isEditMode && postError) return <div className="text-center text-lg text-red-600">Error loading post: {postError}</div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">{isEditMode ? 'Edit Post' : 'Create New Post'}</h1>
            {submitError && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{submitError}</div>}
            {submissionSuccess && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">Operation successful!</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.title ? 'border-red-500' : ''}`}
                        placeholder="Enter post title"
                    />
                    {formErrors.title && <p className="text-red-500 text-xs italic mt-1">{formErrors.title}</p>}
                </div>
                <div>
                    <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">Content:</label>
                    <textarea
                        id="content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows="8"
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.content ? 'border-red-500' : ''}`}
                        placeholder="Write your post content here..."
                    ></textarea>
                    {formErrors.content && <p className="text-red-500 text-xs italic mt-1">{formErrors.content}</p>}
                </div>
                <div>
                    <label htmlFor="author" className="block text-gray-700 text-sm font-bold mb-2">Author:</label>
                    <input
                        type="text"
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.author ? 'border-red-500' : ''}`}
                        placeholder="Enter author name"
                    />
                    {formErrors.author && <p className="text-red-500 text-xs italic mt-1">{formErrors.author}</p>}
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">Category:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formErrors.category ? 'border-red-500' : ''}`}
                    >
                        <option value="">Select a category</option>
                        {categories && categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    {formErrors.category && <p className="text-red-500 text-xs italic mt-1">{formErrors.category}</p>}
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:opacity-50"
                    disabled={submitLoading}
                >
                    {submitLoading ? 'Saving...' : (isEditMode ? 'Update Post' : 'Create Post')}
                </button>
            </form>
        </div>
    );
};

