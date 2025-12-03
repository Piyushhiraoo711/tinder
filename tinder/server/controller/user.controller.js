import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// register user
export const register = async (req, res) => {
  try {
    const { fullName, phone, gender, password } = req.body;

    if (!(fullName && phone && gender && password)) {
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
      fullName,
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

    const user = await User.findOne({ phone });

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

    // user = {
    //   _id: user._id,
    //   fullName: user.fullName,
    //   phone: user.phone,
    //   gender: user.gender,
    // };

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "Strict",
      })
      .json({
        success: true,
        message: `Welcome back ${user.fullName}`,
        // user,
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

// get all connectons of user
export const myConnections = async (req, res) => {
  try {
    const userId = req.id;
    const myConnection = await User.findById(userId);

    const allConnection = await User.find({
      _id: { $in: myConnection.connections },
    }).select("fullName");

    if (!allConnection) {
      return res
        .status(404)
        .json({ success: false, message: "No connection found" });
    }
    return res.status(200).json(allConnection);
  } catch (error) {
    console.log(error);
  }
};

// block user
export const blockConnection = async (req, res) => {
  try {
    const userId = req.id;
    const blockedId = req.params.id;

    const blocker = await User.findById(userId);
    const blocked = await User.findById(blockedId);

    blocker.connections = await blocker.connections.filter(
      (id) => id.toString() !== blockedId
    );
    blocker.sentRequests = await blocker.sentRequests.filter(
      (id) => id.toString() !== blockedId
    );
    blocked.connections = await blocked.connections.filter(
      (id) => id.toString() !== userId
    );

    blocker.blocked.push(blockedId);

    blocker.save();
    blocked.save();

    return res.status(200).json({ success: true, message: "Blocked" });
  } catch (error) {
    console.log(error);
  }
};
