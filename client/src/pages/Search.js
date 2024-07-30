import React from 'react';
import Mylayout from '../components/Layout/Mylayout';
import { useSearch } from '../context/search';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

const Search = () => {
    const [values] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-ruby.vercel.app"

    // Function to get the URL for product photo
    const getProductPhotoUrl = (productId) => {
        return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
    };

    return (
        <Mylayout title={"Search - Cloud Pharmacy"}>
            <div className='container'>
                <div className='text-center'>
                    <h1>Search Result</h1>
                    <h6>{`Found ${values?.results.length} product(s)`}</h6>
                    <div className='product-container mt-4'>
                        {values?.results.length > 0 ? values?.results.map(product => (
                            <div key={product._id} className='product-card'>
                                <img 
                                    style={{ objectFit: "cover" }} 
                                    src={getProductPhotoUrl(product._id)} 
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
                        )) : <p>No products found</p>}
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default Search;
