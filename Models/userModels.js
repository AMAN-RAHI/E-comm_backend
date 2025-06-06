import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, 
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
  },
  password: {
    type: String,
    required: true,
  },

  avatar:{
    type: String,
    default:"",
  },

  verify_email:{
    type: Boolean,
    default:false,
  },

  mobile:{
    type:Number,
    default: null
  },

  last_login_date:{
    type:Date,
    default: ""
  },

  status:  {
    type:String,
    enum: ["Active","Inactive","Suspended"],
    default: "Active"
  },

  address_details:[{
    type:mongoose.Schema.ObjectId,
    ref:'Address'

  }],

  shopping_cart:[{
  type:mongoose.Schema.ObjectId,
    ref:'cartproduct'
  }],

  orderHistory:[{
    type:mongoose.Schema.ObjectId,
      ref:'order'
    }],
    otp: { type: String },

    forget_password_otp:[{
        type:String,
          default:null
        }],
 
 forget_password_expiry:[{
     type:Date,
     default:""
     }],
     
     refreshToken: { type: String },

     role:[{
        type:String,
        enum:['ADMIN','USER'],
        default:"USER"
        }],

    },{
        timestamps:true
    });

    // Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Create and export User model
const Usermodel = mongoose.model("User", userSchema);
export default Usermodel;
