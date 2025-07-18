// src/Router.jsx
import React, { useState, useEffect, createContext, useContext } from 'react';

// Simple Router implementation (as React Router is not directly available in this sandbox)
// In a real React app, you would use 'react-router-dom' like BrowserRouter, Routes, Route, Link, useParams, useNavigate
export const RouterContext = createContext(null);

export const Router = ({ children }) => {
    const [path, setPath] = useState(window.location.pathname);

    useEffect(() => {
        const handlePopState = () => {
            setPath(window.location.pathname);
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const navigate = (newPath) => {
        window.history.pushState({}, '', newPath);
        setPath(newPath);
    };

    return (
        <RouterContext.Provider value={{ path, navigate }}>
            {children}
        </RouterContext.Provider>
    );
};

export const Link = ({ to, children }) => {
    const { navigate } = useContext(RouterContext);
    const handleClick = (e) => {
        e.preventDefault();
        navigate(to);
    };
    return <a href={to} onClick={handleClick} className="text-blue-500 hover:underline">{children}</a>;
};

export const useParams = () => {
    const { path } = useContext(RouterContext);
    const parts = path.split('/');
    // Simple ID extraction for /posts/:id and /edit-post/:id
    if ((parts[1] === 'posts' || parts[1] === 'edit-post') && parts[2]) {
        return { id: parts[2] };
    }
    return {};
};

