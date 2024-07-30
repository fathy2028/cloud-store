import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
    const [categories, setCategories] = useState([]);
    const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-ruby.vercel.app"

    const getCategories = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`); // Use the backend URL
            setCategories(data?.categories || []); // Handle the response correctly
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getCategories();
    }, [backendUrl]); // Add backendUrl as a dependency

    return categories;
}
