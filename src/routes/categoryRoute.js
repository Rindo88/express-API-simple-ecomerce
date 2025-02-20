import { Router } from "express";
import authVerif from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/rolesMiddleware.js";
import { addCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/categoryController.js";

const router = Router();

router.get('/allcategory', authVerif, getAllCategory);
router.post('/category', authVerif, isAdmin, addCategory);
router.put('/category/:categoryId', authVerif, isAdmin, updateCategory);
router.delete('/category/:categoryId', authVerif, isAdmin, deleteCategory)


export default router;