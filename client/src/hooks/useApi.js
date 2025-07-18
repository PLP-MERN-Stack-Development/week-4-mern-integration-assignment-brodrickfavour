// src/hooks/useApi.js
import { useState, useCallback } from 'react';
import axios from 'axios'; // Import axios

// Custom Hook for API Calls
export const useApi = (baseUrl) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (endpoint = '', options = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Construct axios request config
            const axiosConfig = {
                url: `${baseUrl}${endpoint}`,
                method: options.method || 'GET', // Default to GET
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                // Axios uses 'data' for request body with POST, PUT, PATCH
                data: options.body ? JSON.parse(options.body) : undefined,
                // Axios uses 'params' for URL query parameters (not used in this API, but good to know)
                // params: options.params,
            };

            const response = await axios(axiosConfig);

            // Axios automatically throws for 4xx/5xx responses, so no need for response.ok check
            // Data is directly in response.data
            const result = response.data;

            // Handle 204 No Content for DELETE requests (axios returns undefined data for 204)
            if (response.status === 204) {
                setData(null); // Or whatever makes sense for your app when a resource is deleted
                return null;
            }

            setData(result);
            return result;
        } catch (err) {
            // Axios error handling structure
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setError(err.response.data.error || err.response.data.message || err.message);
                console.error("API call failed (server response):", err.response.data);
            } else if (err.request) {
                // The request was made but no response was received
                setError('No response received from server. Please check your network connection or server status.');
                console.error("API call failed (no response):", err.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                setError(err.message);
                console.error("API call failed (request setup):", err.message);
            }
            throw err; // Re-throw to allow component-level handling
        } finally {
            setLoading(false);
        }
    }, [baseUrl]); // Dependency array for useCallback

    return { data, loading, error, fetchData, setData }; // setData is exposed for manual updates
};

