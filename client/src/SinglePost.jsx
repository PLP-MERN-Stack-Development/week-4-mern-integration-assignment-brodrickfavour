// src/SinglePost.jsx
import React, { useEffect, useContext } from 'react';
import { ApiContext } from './App';
import { useApi } from './hooks/useApi';
import { Link, useParams } from './Router';

export const SinglePost = () => {
    const { id } = useParams();
    const { baseUrl } = useContext(ApiContext);
    const { data: post, loading, error, fetchData } = useApi(baseUrl);

    useEffect(() => {
        if (id) {
            fetchData(`/api/posts/${id}`);
        }
    }, [id, fetchData]);

    if (loading) return <div className="text-center text-lg text-gray-700">Loading post...</div>;
    if (error) return <div className="text-center text-lg text-red-600">Error: {error}</div>;
    if (!post) return <div className="text-center text-lg text-gray-600">Post not found.</div>;

    return (
        <div className="bg-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
            <p className="text-gray-600 text-lg mb-6">
                By <span className="font-semibold">{post.author}</span> in <span className="font-semibold">{post.category?.name || 'Uncategorized'}</span>
                <span className="ml-4 text-sm">Published on: {new Date(post.createdAt).toLocaleDateString()}</span>
            </p>
            <div className="prose prose-lg text-gray-800 leading-relaxed mb-8">
                <p>{post.content}</p>
            </div>
            <Link to="/" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                Back to Posts
            </Link>
        </div>
    );
};

