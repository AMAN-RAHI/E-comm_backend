import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import { addtomyList } from '../controllers/myListControllers.js'

const MyListRouter = express.Router();

MyListRouter.post('/add',protect,addtomyList)

export default MyListRouter