// src/App.jsx
import React, { createContext } from 'react';
import { Router } from './Router';
import { Layout } from './Layout';
import { PostList } from './PostList';
import { SinglePost } from './SinglePost';
import { PostForm } from './PostForm';
import { CategoryForm } from './CategoryForm';

// Context for API URL (optional, but good practice for larger apps)
export const ApiContext = createContext(null);

// Main App Component
const App = () => {
    // Determine the base URL for your API.
    // In a real application, this would typically come from environment variables.
    // For this demonstration, we'll assume it's running on localhost:3000
    const API_BASE_URL = 'http://localhost:3000';

    const renderContent = () => {
        const path = window.location.pathname; // Get current path from window object for direct comparison

        if (path === '/') {
            return <PostList />;
        } else if (path === '/create-post') {
            return <PostForm />;
        } else if (path.startsWith('/posts/')) {
            // Extract ID for single post view
            // Note: In a real react-router-dom setup, useParams() would handle this.
            const postId = path.split('/')[2];
            return <SinglePost />;
        } else if (path.startsWith('/edit-post/')) {
            // Extract ID for edit post view
            const postId = path.split('/')[2];
            return <PostForm postId={postId} />;
        } else if (path === '/create-category') {
            return <CategoryForm />;
        }
        return <div className="text-center text-xl font-bold text-gray-800">404 - Page Not Found</div>;
    };

    return (
        <ApiContext.Provider value={{ baseUrl: API_BASE_URL }}>
            <Router>
                <Layout>
                    {renderContent()}
                </Layout>
            </Router>
        </ApiContext.Provider>
    );
};

export default App;

