import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = 'http://localhost:5000/api';
// Ensure this matches your backend URL. 
export const SOCKET_URL = 'http://localhost:5000';

// Axios Instance
export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add Token to requests
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['x-auth-token'] = token;
        }
    }
    return config;
});

// Socket Instance
export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false, // Connect manually when needed
});
