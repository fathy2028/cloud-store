import React, { useEffect, useState } from 'react';
import Mylayout from './../components/Layout/Mylayout';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import '../styles/home.css';

const ProductDetails = () => {
    const [cart, setCart] = useCart();
    const params = useParams();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const navigate = useNavigate();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-gamma.vercel.app"

    const getProduct = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/product/get-product/${params.id}`);
            setProduct(data?.product);
            getSimilarProducts(data?.product._id, data?.product.category._id);
        } catch (error) {
            console.log(error);
            toast.error("Error in fetching this product");
        }
    };

    useEffect(() => {
        if (params.id) {
            getProduct();
        }
    }, [params.id]);

    const getSimilarProducts = async (pid, cid) => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/product/related-product/${pid}/${cid}`);
            if (data?.success) {
                setRelatedProducts(data.products);
            } else {
                toast.error("Cannot get similar products");
            }
        } catch (error) {
            console.log(error);
            toast.error("Error in fetching similar products");
        }
    };

    return (
        <Mylayout title={"Product Details - Cloud Pharmacy"}>
            <div className='row container mt-2'>
                <div className='col-md-6'>
                    <img 
                        style={{ objectFit: "cover" }} 
                        height={"400px"} 
                        width={"400px"} 
                        src={`${backendUrl}/uploads/${product.photo}`} 
                        alt={product.name}  
                    />
                </div>
                <div className='col-md-6'>
                    <h1 className='text-center'>Product Details</h1>
                    <h5>Name: {product.name}</h5>
                    <h5>Price: <b>EGP</b>{product.price}</h5>
                    <h5>Description: {product.description}</h5>
                    <h5>Category: {product.category?.name}</h5>
                    <button 
                        style={{ backgroundColor: "black" }} 
                        className='btn btn-primary' 
                        onClick={() => {
                            setCart([...cart, product]);
                            toast.success("Item added to cart successfully");
                            localStorage.setItem("cart", JSON.stringify([...cart, product]));
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
            <div className='row'>
                <h2 className='text-start mt-4'>Similar Products</h2>
                <div className='product-container'>
                    {relatedProducts.length > 0 ? relatedProducts.map(product => (
                        <div key={product._id} className='product-card'>
                            <img 
                                style={{ objectFit: "cover" }} 
                                src={`${backendUrl}/uploads/${product.photo}`} 
                                alt={product.name} 
                                className='product-image' 
                            />
                            <div className='product-info'>
                                <h3 className='product-name'>{product.name}</h3>
                                <p className='product-description'>{product.description.substring(0, 40)}</p>
                                <p className='product-price'><b>EGP</b>{product.price}</p>
                            </div>
                            <div className='product-buttons'>
                                <button 
                                    className='btn btn-primary' 
                                    onClick={() => {
                                        setCart([...cart, product]);
                                        toast.success("Item added to cart successfully");
                                        localStorage.setItem("cart", JSON.stringify([...cart, product]));
                                    }}
                                >
                                    Add to Cart
                                </button>
                                <button 
                                    className='btn btn-secondary' 
                                    onClick={() => navigate(`/product/${product._id}`)}
                                >
                                    More Details
                                </button>
                            </div>
                        </div>
                    )) : <h5>No similar products found</h5>}
                </div>
            </div>
        </Mylayout>
    );
};

export default ProductDetails;
