import mongoose from "mongoose";

const { Schema, model } = mongoose;
const mediaSchema = new Schema(
  {
    profile_image: {
      type: String,
      default: "",
    },
    post: {
      type: String,
      enum: [],
    },
    vedio: {
      type: String,
      enum: [],
    },
  },
  { timestamps: true }
);

const Media = model("Media", mediaSchema);
export default Media;