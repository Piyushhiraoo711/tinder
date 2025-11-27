import bcrypt from "bcryptjs";
import User from "../model/user.model";

export const register = async (req, res) => {
  try {
    const { name, phone, dob, gender, password } = req.body;

    if (!(name && phone && dob && gender && password)) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.find({ phone });
    if (user) {
      return res.json({
        success: false,
        message: "User already registered with this phone",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      phone,
      dob,
      gender,
      password: hashedPassword,
    });

    return res.json({ success: true, message: "Account created" });
  } catch (error) {
    console.log(error);
  }
};
