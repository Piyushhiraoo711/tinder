import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// register user
export const register = async (req, res) => {
  try {
    const { name, phone, gender, password } = req.body;

    if (!(name && phone && gender && password)) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ phone });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already registered with this phone",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      phone,
      gender,
      password: hashedPassword,
    });
    return res.status(201).json({ success: true, message: "Account created" });
  } catch (error) {
    console.log(error);
  }
};

// login user
export const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    if (!(phone && password)) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    let user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect phone or password",
      });
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const tokenData = {
      userId: user._id,
    };
    
    const token = await jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "3d",
    });

    user = {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      gender: user.gender,
    };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "Strict",
      })
      .json({
        success: false,
        message: `Welcome back ${user.name}`,
        user,
      });
  } catch (error) {
    console.log(error);
  }
};

// logout user
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};
