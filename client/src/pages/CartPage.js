import React from 'react';
import Mylayout from './../components/Layout/Mylayout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const navigate = useNavigate();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-test-api.vercel.app"

    const addToCart = (product) => {
        let newCart = [...cart];
        newCart.push(product);

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success("Item added to cart successfully");
    };

    const removeCartItem = (id) => {
        try {
            let newCart = [...cart];
            const productIndex = newCart.findIndex(item => item._id === id);

            if (productIndex > -1) {
                newCart.splice(productIndex, 1);
            }

            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success("Item removed successfully from your cart");
        } catch (error) {
            console.log(error);
            toast.error("Failed to remove the item from the cart");
        }
    };

    const totalPrice = () => {
        try {
            let total = 0;
            cart?.forEach(item => { total += item.price; });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "EGP"
            });
        } catch (error) {
            console.log(error);
        }
    };

    const getProductCount = (id) => {
        return cart.filter(item => item._id === id).length;
    };

    const uniqueProducts = [...new Map(cart.map(item => [item._id, item])).values()];

    const placeOrder = async () => {
        try {
            const totalcash = cart.reduce((total, item) => total + item.price, 0);

            const { data } = await axios.post(`${backendUrl}/api/v1/order/create`, {
                products: cart.map(item => item._id),
                totalcash
            }, {
                headers: {
                    Authorization: auth.token
                }
            });

            if (data.success) {
                setCart([]);
                localStorage.removeItem("cart");
                toast.success(data.message);
                navigate('/dashboard/user/orders'); // Assuming you have an orders page to show placed orders
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to place the order");
        }
    };

    return (
        <Mylayout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2 mb-1'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length > 0 ? `You have ${cart?.length} Items in Your Cart ${auth?.token ? "" : "Please Login to Checkout"}` : "Your Cart Is Empty"}
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {uniqueProducts.map(p => (
                            <div key={p._id} className='row mb-2 card p-3 flex-row'>
                                <div className='col-md-4'>
                                    <img style={{ objectFit: "fill" }} width={"100px"} height={"100px"} src={`${backendUrl}/uploads/${p.photo}`} alt={p.name} className='product-image' />
                                </div>
                                <div className='col-md-8'>
                                    <h4>{p.name}</h4>
                                    <p>{p.description.substring(0, 30)}</p>
                                    <h3><b>EGP</b>{p.price}</h3>
                                    <p>Quantity: {getProductCount(p._id)}</p>
                                    <div className='d-flex align-items-center'>
                                        <button className='btn btn-danger me-2' onClick={() => removeCartItem(p._id)}>
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <button className='btn btn-primary' onClick={() => addToCart(p)}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>Cart Summary</h2>
                        <h5>Total | CheckOut | Payment</h5>
                        <hr />
                        <h4>Total: {totalPrice()}</h4>
                        {
                            auth?.user?.address ? (
                                <>
                                    <div className='mb-3'>
                                        <h4>Current Address</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>Update Address</button>
                                    </div>
                                </>
                            ) : (
                                <div className='mb-3'>
                                    {
                                        auth?.token ? (
                                            <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>Update Address</button>
                                        ) : (
                                            <button className='btn btn-outline-warning' onClick={() => navigate("/login", { state: "/cart" })}>Please Login To CheckOut</button>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            cart.length > 0 && auth?.token && (
                                <button className='btn btn-success' onClick={placeOrder}>Place Order</button>
                            )
                        }
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default CartPage;
