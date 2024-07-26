import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Mylayout from '../components/Layout/Mylayout';
import { useCart } from '../context/cart';
import '../styles/home.css';

const Category = () => {
    const { id } = useParams(); // Get category ID from the URL
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-gamma.vercel.app"

    const fetchProductsByCategory = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/v1/product/productsbycategory/${id}`);
            setLoading(false);
            if (data?.success) {
                setProducts(data.products);
                if (data.products.length > 0) {
                    setCategory(data.products[0].category); // Assuming all products have the same category
                }
            } else {
                toast.error("Failed to fetch products");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error("Error while fetching products");
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductsByCategory();
        }
    }, [id]);

    return (
        <Mylayout title={`Products in ${category.name} - Cloud Pharmacy`}>
            <div className='row mt-3'>
                <div className='col-md-12'>
                    <h1 className='text-center'>{category.name} Products</h1>
                    <div className='product-container'>
                        {products.length > 0 ? (
                            products.map(product => (
                                <div key={product._id} className='product-card'>
                                    <img src={`${backendUrl}/uploads/${product.photo}`} alt={product.name} className='product-image' />
                                    <div className='product-info'>
                                        <h3 className='product-name'>{product.name}</h3>
                                        <p className='product-description'>{product.description.substring(0, 40)}</p>
                                        <p className='product-price'><b>EGP</b>{product.price}</p>
                                    </div>
                                    <div className='product-buttons'>
                                        <button className='btn btn-primary' onClick={() => { setCart([...cart, product]); toast.success("Item added to cart successfully"); localStorage.setItem("cart", JSON.stringify([...cart, product])) }}>Add to Cart</button>
                                        <button className='btn btn-secondary' onClick={() => navigate(`/product/${product._id}`)}>More Details</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No products found</p>
                        )}
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default Category;
