import mongoose from "mongoose";

const myListSchema = new mongoose.Schema({
    productId:{
           type:mongoose.Schema.ObjectId,
           ref :'product',
          
       },
   
    userId:{
            type:mongoose.Schema.ObjectId,
            ref:'User'
        },
        productTitle:{
          type:String,
          required : true
        },
        image:{
            type:String,
            required : true
        },
        ratings:{
            type:Number,
            required:true
        },
     oldPrice:{
            type:Number,
            required:true
        },
    Price :{
        type:Number,
        required:true
    },
    discount :{
        type : Number,
        required:true
    },
    brand :{
        type:String,
        required:true
    }

},
{timestamps:true});

const mylistModel = mongoose.model("myList",myListSchema);
export default mylistModel


