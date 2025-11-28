import mongoose, { trusted } from "mongoose";

const { Schema, model } = mongoose;
const profileSchema = new Schema(
  {
    bio: {
      type: String,
    },
    age: {
      type: Number,
    },
    dob: {
      type: Date,
    },
    location: {
      type: String,
    },
    interest: [{ type: String }],
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
    },
  },
  { timestamps: true }
);

const Profile = model("Profile", profileSchema);
export default Profile;
