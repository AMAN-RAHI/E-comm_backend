import {Router} from 'express'
import { protect } from '../middleware/authMiddleware.js'


import {addItemtocart} from '../controllers/cartController.js'

const cartproductRouter =Router()

cartproductRouter.post('/add',protect,addItemtocart)
export default cartproductRouter