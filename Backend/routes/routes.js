import express from "express";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExist = await User.findOne({email});
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    const token = generateToken(user._id); //generate JWT token

    if (user) {
      return res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token, //send token in response
      });
    }
  } catch (error) {
    return res.status(400).json({ message: "User not created" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id); //generate JWT token
      return res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token, //send token in response
      });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Login failed" });
  }
});

router.get("/profile", authMiddleware, async (req, res) => {
     res.send(req.user); //user is set by authMiddleware
});


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { //generate JWT token
    expiresIn: "30d",
  });
}


export default router;
