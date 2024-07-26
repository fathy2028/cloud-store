import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/auth';
import toast from 'react-hot-toast';
import Mylayout from '../../components/Layout/Mylayout';
import AdminMenu from '../../components/Layout/AdminMenu';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [auth] = useAuth();
    const backendUrl = process.env.BACKEND_URL || "https://cloud-test-api.vercel.app"

    useEffect(() => {
        if (auth?.token) {
            fetchAllOrders();
        }
    }, [auth?.token]);

    const fetchAllOrders = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/order/all-orders`, {
                headers: {
                    Authorization: `${auth.token}`,
                },
            });
            if (data.success) {
                setOrders(data.orders);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch orders');
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const { data } = await axios.put(
                `${backendUrl}/api/v1/order/update-status/${orderId}`,
                { status },
                {
                    headers: {
                        Authorization: `${auth.token}`,
                    },
                }
            );
            if (data.success) {
                fetchAllOrders(); // Refresh the order list
                toast.success('Order status updated successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to update order status');
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const { data } = await axios.delete(
                `${backendUrl}/api/v1/order/delete/${orderId}`,
                {
                    headers: {
                        Authorization: `${auth.token}`,
                    },
                }
            );
            if (data.success) {
                fetchAllOrders(); // Refresh the order list
                toast.success('Order deleted successfully');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to delete order');
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredOrders = orders.filter(order =>
        order.customer && order.customer.name && order.customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Mylayout title={"Dashboard - All Orders"}>
            <div className="container-fluid m-3 p-3">
                <div className="row">
                    <div className="col-md-3">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9">
                        <h1>All Orders</h1>
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search by customer name"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        {filteredOrders.map((order) => (
                            <div key={order._id} className="card mb-2">
                                <div className="card-body">
                                    <h5 className="card-title">Order ID: {order._id}</h5>
                                    <p className="card-text">Customer: {order.customer ? order.customer.name : "No customer information"}</p>
                                    <p className="card-text">Address: {order.customer ? order.customer.address : "No address information"}</p>
                                    <p className="card-text">Phone: {order.customer ? order.customer.phone : "No Phone information"}</p>
                                    <p className="card-text">Total Cash: {order.totalcash} EGP</p>
                                    <p className="card-text">Status: {order.status}</p>
                                    <div className="mb-2">
                                        <strong>Products:</strong>
                                        <div className="d-flex flex-wrap">
                                            {order.products.map((product) => (
                                                <div key={product._id} className="d-flex align-items-center me-2 mb-2">
                                                    <img
                                                        src={`${backendUrl}/uploads/${product.photo}`} // Use the backend URL for the image source
                                                        alt={product.name}
                                                        width="50"
                                                        height="50"
                                                        className="me-1"
                                                    />
                                                    <div>
                                                        <span>{product.name}</span>
                                                        <br />
                                                        <span>{product.price} EGP</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <select
                                            className="form-select me-2"
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                                        >
                                            <option value="Not processed">Not processed</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Shipped">Shipped</option>
                                            <option value="Out For Delivery">Out For Delivery</option>
                                            <option value="Delivered">Delivered</option>
                                            <option value="Canceled">Canceled</option>
                                        </select>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteOrder(order._id)}
                                        >
                                            Delete Order
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default AllOrders;
