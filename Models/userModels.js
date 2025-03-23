import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This field is mandatory
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensures email is unique
    lowercase: true, // Converts email to lowercase
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
    ref:'address'

  }],

  shopping_cart:[{
  type:mongoose.Schema.ObjectId,
    ref:'cartproduct'
  }],

  orderHistory:[{
    type:mongoose.Schema.ObjectId,
      ref:'order'
    }],

    forget_password_otp:[{
        type:String,
          default:null
        }],
 
 forget_password_expiry:[{
     type:Date,
     default:""
     }],

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
