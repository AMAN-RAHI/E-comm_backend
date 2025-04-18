import {Router} from "express"
import { protect } from '../middleware/authMiddleware.js'
import { AddressController, deleteAddress, getAddressByUserId } from "../controllers/addressController.js";

const addressRouter=Router();

addressRouter.post('/add',protect,AddressController )

addressRouter.get('/get/:userId',getAddressByUserId)

addressRouter.delete('/:id',protect,deleteAddress)

export default addressRouter
