import mongoose from "mongoose";

const cartItemSchema= new mongoose.Schema({
    productTitle:{
        type:String,
        required:true
    },

   image:{
        type:String,
        required:true
    },

    rating:{
        type:Number,
        required:true
 },

 price:{
        type:Number,
        required:true
 },

 quantity:{
        type:Number,
        required:true
 },

 SubTotal:{
        type:Number,
        required:true
 },

 productId:{
        type:String,
        required:true
 },

 

 oldPrice:{
        type:Number,
        required:true
 },
 countInstock:{
    type:Number,
    required:true
 },

  userId:{
        type:String,
        required:true
 },


},{timestamps:true})

const cartItemtModel = mongoose.model('cartItem',cartItemSchema)

export default cartItemtModel