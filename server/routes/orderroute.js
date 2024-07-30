// orderRoutes.js
import express from 'express';
import { requiredsignin, isadmin } from '../middlewares/authMiddleware.js';
import {
    createOrderController,
    getUserOrdersController,
    getAllOrdersController,
    updateOrderStatusController,
    deleteOrderController,
    deleteUserOrderController // Add this import
} from '../controllers/orderController.js';

const router = express.Router();

// Create order
router.post('/create', requiredsignin, createOrderController);

// Get user orders
router.get('/user-orders', requiredsignin, getUserOrdersController);

// Get all orders (admin only)
router.get('/all-orders', requiredsignin, isadmin, getAllOrdersController);

// Update order status (admin only)
router.put('/update-status/:orderId', requiredsignin, isadmin, updateOrderStatusController);

// Delete order (admin only)
router.delete('/delete/:orderId', requiredsignin, isadmin, deleteOrderController);

// Delete user order
router.delete('/user-order/:orderId', requiredsignin, deleteUserOrderController);

export default router;
