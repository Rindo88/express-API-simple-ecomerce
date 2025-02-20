import { Router } from "express";
import authVerif from "../middlewares/authMiddleware.js";
import { isSeller } from "../middlewares/rolesMiddleware.js";
import { addProduct, deleteProduct, getAllProduct, updateProduct, products, getProductId, searchProductName } from "../controllers/productController.js";

const router = Router();

router.get('/products', authVerif, products)
router.get('/product/:productId', authVerif, getProductId)
router.get('/searchProduct', authVerif, searchProductName)
router.get('/myProducts', authVerif, isSeller, getAllProduct);
router.post('/product', authVerif, isSeller, addProduct);
router.put('/product/:productId', authVerif, isSeller, updateProduct)
router.delete('/product/:productId', authVerif, isSeller, deleteProduct);

export default router;