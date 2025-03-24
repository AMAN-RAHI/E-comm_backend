import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import { addtomyList,getmyListitems,deletemyListitems} from '../controllers/myListControllers.js'

const MyListRouter = express.Router();

MyListRouter.post('/add',protect,addtomyList)

//get route
MyListRouter.get('/:userId',getmyListitems)

//delete route 
MyListRouter.delete('/:id',protect,deletemyListitems)

export default MyListRouter