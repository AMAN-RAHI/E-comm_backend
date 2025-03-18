import express from 'express';
import userRoutes from "./Routes/userRoutes.js";
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import ConnectDb from './config/connectdb.js';

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

ConnectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

