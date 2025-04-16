import {Router} from "express"
import { protect } from '../middleware/authMiddleware.js'
import { AddressController } from "../controllers/addressController.js";

const addressRouter=Router();

addressRouter.post('/add',protect,AddressController )

export default addressRouter
