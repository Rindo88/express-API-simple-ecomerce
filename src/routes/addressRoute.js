import { Router } from "express";
import authVerif from "../middlewares/authMiddleware.js";
import { addAddress, deleteAddress, getAddress, updateAddress } from "../controllers/addressController.js";

const router = Router();

router.get('/address', authVerif, getAddress);
router.post('/address', authVerif, addAddress);
router.delete('/address/:addressId', authVerif, deleteAddress);
router.put('/address/:addressId', authVerif, updateAddress);

export default router;