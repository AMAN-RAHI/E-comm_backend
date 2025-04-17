import {Router} from "express"
import { protect } from '../middleware/authMiddleware.js'
import { AddressController, getAddressByUserId } from "../controllers/addressController.js";

const addressRouter=Router();

addressRouter.post('/add',protect,AddressController )

addressRouter.get('/get/:userId',getAddressByUserId)

export default addressRouter
