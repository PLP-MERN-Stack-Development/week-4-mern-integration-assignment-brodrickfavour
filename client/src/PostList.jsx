// src/PostList.jsx
import React, { useEffect, useContext } from 'react';
import { ApiContext } from './App';
import { useApi } from './hooks/useApi';
import { Link, RouterContext } from './Router';

export const PostList = () => {
    const { baseUrl } = useContext(ApiContext);
    const { data: posts, loading, error, fetchData } = useApi(baseUrl);
    const { navigate } = useContext(RouterContext);

    useEffect(() => {
        fetchData('/api/posts');
    }, [fetchData]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await fetchData(`/api/posts/${id}`, { method: 'DELETE' });
                // Re-fetch all posts to ensure consistency after deletion
                fetchData('/api/posts');
            } catch (err) {
                alert(`Failed to delete post: ${err.message}`);
            }
        }
    };

    if (loading) return <div className="text-center text-lg text-gray-700">Loading posts...</div>;
    if (error) return <div className="text-center text-lg text-red-600">Error: {error}</div>;
    if (!posts || posts.length === 0) return <div className="text-center text-lg text-gray-600">No posts found. Create one!</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
                <div key={post._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
                    <p className="text-gray-600 text-sm mb-3">By {post.author} in {post.category?.name || 'Uncategorized'}</p>
                    <p className="text-gray-700 text-base line-clamp-3 mb-4">{post.content}</p>
                    <div className="flex justify-between items-center">
                        <Link to={`/posts/${post._id}`} className="text-blue-600 hover:text-blue-800 font-medium">Read More</Link>
                        <div className="space-x-2">
                            <button
                                onClick={() => navigate(`/edit-post/${post._id}`)}
                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors duration-200"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

