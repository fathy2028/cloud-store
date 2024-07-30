import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';

// Create order
export const createOrderController = async (req, res) => {
    try {
        const { products, totalcash } = req.body;
        const newOrder = new orderModel({
            products,
            customer: req.user._id,
            totalcash
        });
        await newOrder.save();
        res.status(201).send({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

// Get user orders
export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ customer: req.user._id }).populate('products');
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in fetching orders",
            error
        });
    }
};

// Get all orders (admin only)
// orderController.js
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find().populate('products').populate('customer');
        res.status(200).send({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to get orders',
            error: error.message
        });
    }
};


// Update order status (admin only)
export const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Update the order status
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
            .populate('products'); // Populate products to get product details

        if (!updatedOrder) {
            return res.status(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        // If the order status is 'Delivered', decrease the quantity of the products
        if (status === 'Delivered') {
            const productCounts = updatedOrder.products.reduce((counts, product) => {
                counts[product._id] = (counts[product._id] || 0) + 1;
                return counts;
            }, {});

            for (const productId in productCounts) {
                const quantityToDecrement = productCounts[productId];

                // Decrease the quantity for the product in the database
                await productModel.findByIdAndUpdate(productId, {
                    $inc: { quantity: -quantityToDecrement }
                });
            }
        }

        res.status(200).send({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};
// Delete order (admin only)
export const deleteOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        await orderModel.findByIdAndDelete(orderId);
        res.status(200).send({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
};

export const deleteUserOrderController = async (req, res) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.orderId, customer: req.user._id });
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order not found or not authorized to delete',
            });
        }
        await orderModel.findByIdAndDelete(req.params.orderId);
        res.status(200).send({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to delete order',
            error: error.message,
        });
    }
}