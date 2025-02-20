import { Router } from "express";
import authVerif from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/home', authVerif, (req,res) => {
  res.status(200).send({messsage: 'success'})
})

export default router