import express from "express";
import cors from 'cors';
import authentication from "./src/routes/authRoute.js";
import home from "./src/routes/homeRoute.js";
import product from './src/routes/productRoute.js';
import category from './src/routes/categoryRoute.js';
import address from "./src/routes/addressRoute.js";
import order from './src/routes/orderRoutes.js';
import dotenv from 'dotenv';
const app = express();

dotenv.config();
app.use(express.json());
app.use(cors());

app.use('/api', authentication);
app.use('/api', home);
app.use('/api', product);
app.use('/api', category);
app.use('/api', address)
app.use('/api', order);


app.use('/api', (req,res) =>{
  res.status(404).json({message: "Page Not Found"})
});

app.listen(process.env.PORT, () => {
  console.log('server running on port 3000')
});