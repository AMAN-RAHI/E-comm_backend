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

//get cart items
export const getcartItems =async (req,res) => 
    {
    try {
        const {userId}= req.params;
        const cartItems =await cartproductModel.find({
            userId:userId
        }).populate('productId')

        if(!cartItems.length) return res.status(404).json({success:false,message:'the item is not found'})

            return res.status(200).json({success:true, cartItems})
    } catch (error) {
        console.log('server error', error)
        return res.status(500).json({
            message:error.message|| 'Internal server error',
            success : false
        })
    }
}

//update the cart 
export const updateCart=async (req,res) => {
    try {
        const {cartItemId} =req.params;
        const {quantity} =req.body;

        if(!quantity || quantity<1){
            return res.status(400).json({
                success: false,
                message: "Please provide a valid quantity"
            });
        }
        const updatedCartItem = await cartproductModel.findByIdAndUpdate(
            cartItemId,
            { quantity },
            { new: true }
        );

        if (!updatedCartItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Cart item updated successfully",
            cartItem: updatedCartItem
        });
    } catch (error) {
        console.log("Server error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}

export const removecartItem = async (req,res) => {
    try {
        const { cartItemId, userId } = req.params; // can remove refernce from both user =model and cart model

        const removeItem = await cartproductModel.findByIdAndDelete(cartItemId)
        if (!removeItem) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        // lets also remove from the shopping cart referenced form the user
        await Usermodel.findByIdAndUpdate(userId, {
            $pull: { shopping_cart: cartItemId }
        });

        res.status(200).json({
            success: true,
            message: "Cart item removed successfully"
        });
    } catch (error) {
        console.log("Server error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
}