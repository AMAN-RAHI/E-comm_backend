import mongoose from "mongoose";

const productSchema= new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required : true,
    },

    images:[
        {
          type:String,
          required:true
    }
],
brand :{
    type:String,
    default : ''
},

price:{
    type:Number,
    default:0
},

oldPrice:{
    type:Number,
    default:0
},
catName:{
    type:String,
    default:''
},
catId:{
    type:String,
    default:''
},

subcatId:{
    type:String,
    default:''
},

subcat:{
    type:String,
    default:''
},

subcatName:{
    type:String,
    default:''
},

thirdsubCat:{
    type:String,
    default:''  
},

thirdsubCatName:{
    type:String,
    default:''  
},
thirdsubCatid:{
    type:String,
    default:''  
},
category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    
},
countInstock:{
    type:Number,
    required:true
},
rating:{
    type:Number,
    default:0
},
isFeatured:{
    type:Boolean,
    default:false
},
discount:{
    type:Number,
    required:true
},
productRam:[{
    type:String,
    default:null
}],

size:[{
    type:String,
    default:null
}],

productWeight:[{
    type:String,
    default:null
}],

location:[{
    value:{
        type:String
    },
    label:{
        type:String
    }
}],



},{ timestamps: true }); // Auto-adds createdAt & updatedAt fields

const ProductModel = mongoose.model("product", productSchema);
export default ProductModel;


