import {Router} from "express"
import { protect } from '../middleware/authMiddleware.js'
import { AddressController, deleteAddress, getAddressByUserId,updateAddress } from "../controllers/addressController.js";

const addressRouter=Router();

addressRouter.post('/add',protect,AddressController )

addressRouter.get('/get/:userId',getAddressByUserId)

addressRouter.delete('/:id',protect,deleteAddress)

addressRouter.put('/update/:id', protect, updateAddress);


export default addressRouter
