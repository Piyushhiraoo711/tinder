import mongoose from "mongoose";

const { Schema, model } = mongoose;
const mediaSchema = new Schema({
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
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Media = model("Media", mediaSchema);
export default Media;
