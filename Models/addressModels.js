import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  address_line: {
    type: String,
    required: true, // Mandatory field
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },

  country: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    required: true,
  },
  
  pincode: {
    type: Number,
    required: true,
  },

  status: {
    type: Boolean,
    default: true,
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    default: "",
  },
}, { timestamps: true }); // Auto-adds createdAt & updatedAt fields

const AddressModel = mongoose.model("Address", addressSchema);
export default AddressModel;
