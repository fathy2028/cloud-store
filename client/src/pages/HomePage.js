import React, { useState, useEffect } from 'react';
import Mylayout from '../components/Layout/Mylayout';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useCart } from '../context/cart';
import Slider from 'react-slick';
import pharmacy1 from '../images/store1.jpg';
import pharmacy2 from '../images/store2.jpg';
import pharmacy3 from '../images/store3.jpg';
import pharmacy4 from '../images/store4.jpg';

const sliderImages = [
  pharmacy1,
  pharmacy2,
  pharmacy3,
  pharmacy4
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: true
};

const HomePage = () => {
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const backendUrl = process.env.BACKEND_URL || "https://cloud-store-api-ruby.vercel.app";

  const getTotal = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/product/product-count`);
      if (data?.success) {
        setTotal(data.total);
      } else {
        toast.error("Failed to get the total product count");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`);
      if (data?.success) {
        setCategories(data.categories);
      } else {
        toast.error("Failed to fetch categories");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while fetching categories");
    }
  };

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/v1/product/product-list/${page}`);
      setLoading(false);
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error("Failed to fetch products");
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error("Error while getting products");
    }
  };

  const loadMore = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/v1/product/product-list/${page}`);
      setLoading(false);
      setProducts(prevProducts => [...prevProducts, ...data.products]);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (page === 1) return;
    loadMore();
  }, [page]);

  useEffect(() => {
    getAllCategories();
    getTotal();
    getAllProducts();
  }, []);

  useEffect(() => {
    if (!checked.length && !radio.length) {
      getAllProducts();
    }
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProducts();
    }
  }, [checked, radio]);

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter(c => c !== id);
    }
    setChecked(all);
  };

  const filterProducts = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/v1/product/product-fillter`, { checked, radio });
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error("Failed to filter products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error in filters");
    }
  };

  // Function to get the URL for product photo
  const getProductPhotoUrl = (productId) => {
    return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
  };

  return (
    <Mylayout title={"Home - Cloud Store"}>
      <div className='container'>
        <div className='slider-container pt-6'>
          <Slider {...sliderSettings}>
            {sliderImages.map((image, index) => (
              <div key={index}>
                <img src={image} alt={`Slider ${index}`} className='slider-image' />
              </div>
            ))}
          </Slider>
        </div>

        <div className='row mt-3'>
          <div className='col-md-3'>
            <h4 className='text-center'>Filter by Category</h4>
            <div className='d-flex flex-column m-5'>
              {categories.map(c => (
                <Checkbox key={c._id} onChange={(e) => handleFilter(e.target.checked, c._id)}>
                  {c.name}
                </Checkbox>
              ))}
            </div>
            <h4 className='text-center mt-4'>Filter by Prices</h4>
            <div className='d-flex flex-column m-5'>
              <Radio.Group onChange={e => setRadio(e.target.value)}>
                {Prices.map(p => (
                  <div key={p._id}>
                    <Radio value={p.array}>{p.name}</Radio>
                  </div>
                ))}
              </Radio.Group>
            </div>
            <div className='d-flex flex-column m-5'>
              <button className='btn btn-danger' onClick={() => window.location.reload()}>Reset Filters</button>
            </div>
          </div>
          <div className='col-md-9'>
            <h1 className='text-center'>All Products</h1>
            <div className='product-container'>
              {products.length > 0 ? products.map(product => (
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
                    <button className='btn btn-primary' onClick={() => {
                      const updatedCart = [...cart, product];
                      setCart(updatedCart);
                      localStorage.setItem("cart", JSON.stringify(updatedCart));
                      toast.success("Item added to cart successfully");
                    }}>Add to Cart</button>
                    <button className='btn btn-secondary' onClick={() => navigate(`/product/${product._id}`)}>More Details</button>
                  </div>
                </div>
              )) : <p>No products found</p>}
            </div>
            <div className='m-2 p-3'>
              {products && products.length < total && (
                <button className='btn btn-warning' onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}>
                  {loading ? "Loading...." : "Load more"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Mylayout>
  );
};

export default HomePage;
