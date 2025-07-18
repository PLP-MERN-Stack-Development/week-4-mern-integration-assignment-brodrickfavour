// src/Layout.jsx
import React, { useContext } from 'react';
import { Link, RouterContext } from './Router'; // Import Link from the local Router implementation

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100 font-sans antialiased">
            <header className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 shadow-lg rounded-b-lg">
                <nav className="container mx-auto flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold hover:text-blue-200 transition-colors duration-200">
                        My Blog
                    </Link>
                    <div className="space-x-4">
                        <Link to="/" className="hover:text-blue-200 transition-colors duration-200">Posts</Link>
                        <Link to="/create-post" className="hover:text-blue-200 transition-colors duration-200">Create Post</Link>
                        <Link to="/create-category" className="hover:text-blue-200 transition-colors duration-200">Create Category</Link>
                    </div>
                </nav>
            </header>
            <main className="container mx-auto p-6 mt-4">
                {children}
            </main>
            <footer className="bg-gray-800 text-white text-center p-4 mt-8 rounded-t-lg">
                <p>&copy; {new Date().getFullYear()} Blog App. All rights reserved.</p>
            </footer>
        </div>
    );
};

