import Usermodel from "../Models/userModels.js";
import ProductModel from "../Models/productModels.js";
import cartproductModel from "../Models/cartModels.js";

export const addItemtocart = async (req,res) => {
    try {
        
       
        const {productId,userId,quantity} = req.body

        if(!productId) return res.status(404).json({
            success:false,
            error:true,
            message:'provide productId'
        })

        // check wether the item exists if it exists lets plus its quantity
        let existingItem = await cartproductModel.findOne({productId,userId}) 

        if(existingItem){
            existingItem.quantity += quantity;
            await existingItem.save();
            return res.status(200).json({
                message : 'cart updated',cartItem:existingItem
            })
        }
            // if the itemis not there in cart then we need to add it to cart 

        const newCartitem=new cartproductModel({productId,userId,quantity})
        await  newCartitem.save();

        // also update the shopping cart field from user model
        await Usermodel.findByIdAndUpdate(userId,{
            $push :{
                shopping_cart : newCartitem._id
            }
        })
    
        

        res.status(200).json({success:true,
            message:'the product is added to cart',cartItem:newCartitem
        })

        
    } catch (error) {
        console.log('server error', error)
        return res.status(500).json({
            message:error.message|| 'Internal server error',
            success : false
        })
    }
}