// routes/orderRoutes.js
import { Router } from "express";
import authVerif from "../middlewares/authMiddleware.js";
import { createOrder, getOrders, getOrderById, updateOrderStatus } from "../controllers/orderController.js";
import { addOrderItem, updateOrderItem, deleteOrderItem } from "../controllers/orderItemController.js";

const router = Router();

// Order routes
router.post('/orders', authVerif, createOrder); // Membuat order baru
router.get('/orders', authVerif, getOrders); // Mendapatkan daftar order
router.get('/orders/:orderId', authVerif, getOrderById); // Mendapatkan detail order
router.put('/orders/:orderId', authVerif, updateOrderStatus); // Mengupdate status order

// Order item routes
router.post('/orders/:orderId/items', authVerif, addOrderItem); // Menambahkan item ke order
router.put('/orders/:orderId/items/:itemId', authVerif, updateOrderItem); // Mengupdate item di order
router.delete('/orders/:orderId/items/:itemId', authVerif, deleteOrderItem); // Menghapus item dari order

export default router;