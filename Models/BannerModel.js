import mongoose from "mongoose";

const homeSliderSchema = new mongoose.Schema({
  images: [
    {
      type: String,
      required: true,
    }
  ]
}, { timestamps: true });

const homeSliderModel = mongoose.model('HomeSlider',homeSliderSchema)

export default homeSliderModel 