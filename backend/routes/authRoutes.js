import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();
const router = express.Router();
router.use(cookieParser()); // Enable cookie parsing

// ✅ User Registration
router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;

    // Trim input fields
    username = username.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("✅ Password hashed successfully");

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("✅ User registered successfully");

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "Error during registration" });
  }
});

// ✅ User Login
router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Trim inputs
    email = email.trim().toLowerCase();
    password = password.trim();

    console.log("📌 Login attempt for:", email);

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("✅ User found:", user.email);

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 Password match result:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password mismatch for user:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        username: user.username 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    console.log("✅ Token generated successfully");

    // Set cookie and send response
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    res.json({ 
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        username: user.username
      },
      token 
    });

    console.log("✅ Login successful for user:", email);
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
});

// ✅ User Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "User logged out successfully!" });
});

export default router;
