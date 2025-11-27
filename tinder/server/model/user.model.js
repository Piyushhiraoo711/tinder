import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  bio: {
    type: String,
  },
  dob: {
    type: Date,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
    default: "male",
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
