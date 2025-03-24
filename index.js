import express from 'express';
import userRoutes from "./Routes/userRoutes.js";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import ConnectDb from './config/connectdb.js';
import categoryRouter from './Routes/categoryRoutes.js';
import productRoutes from './Routes/productRoutes.js';
import cartproductRouter from './Routes/cartRoutes.js'
import MyListRouter from './Routes/myListRoutes.js';

const app = express();

//middlewares
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev')); 
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.get('/', (req, res) => {
  res.json('this is new code');
});

const PORT = process.env.PORT || 3000;

// // Use user routes
app.use("/api/users", userRoutes);

// category routes 
app.use("/api/category", categoryRouter);

//products routes
app.use("/api/product", productRoutes);

//cartproduct route
app.use("/api/cart",cartproductRouter);

//myList routes
app.use('/api/myList',MyListRouter)

ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

