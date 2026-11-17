// src/services/api.js
import axios from 'axios';

// Dynamic Backend Base URL (Supports both Localhost:5000 & Live Atlas-connected Server via .env)
export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const API = axios.create({
    baseURL: `${BASE_URL}/api`,
});

// 1. Get All Products (with optional category filter)
export const fetchProducts = (category = 'all') => API.get(`/products?category=${category}`);

// 2. Add New Product (Admin) - DO NOT set Content-Type manually for FormData!
export const addProduct = (productData) => API.post('/products', productData);

// 3. Get Celebrity Lookbook with Hotspots
export const fetchCelebrityLooks = () => API.get('/celebrities');

// 4. Create Razorpay Order Backend Trigger
export const createRazorpayOrder = (orderData) => API.post('/payments/create-order', orderData);

// 5. Save order to database after successful payment
export const saveOrderRecord = async (orderData) => {
    try {
        const response = await API.post('/orders/save-order', orderData);
        return response.data;
    } catch (error) {
        console.error("Error saving order:", error);
        throw error;
    }
};

export default API;