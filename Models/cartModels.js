import mongoose from "mongoose";

const cartproductSchema= new mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        ref :'product'
    },

    quantity:{
        type:Number,
        default:1
    },

    userId:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
},{timestamps:true})

const cartproductModel = mongoose.model('CartProduct',cartproductSchema)

export default cartproductModel