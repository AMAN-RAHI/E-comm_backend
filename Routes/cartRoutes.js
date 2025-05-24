import {Router} from 'express'
import { protect } from '../middleware/authMiddleware.js'


import {addItemtocart,getcartItems, updateCart, removecartItem} from '../controllers/cartController.js'

const cartproductRouter =Router()

cartproductRouter.post('/add',protect,addItemtocart)

cartproductRouter.get('/get',protect,getcartItems)

//update the cart route
cartproductRouter.put('/:cartItemId',protect, updateCart)

// delete the cart item and from users as well 
cartproductRouter.delete("/:cartItemId/:userId", protect,removecartItem);

export default cartproductRouter