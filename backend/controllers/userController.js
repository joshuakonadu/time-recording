import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import { userByEmail, createUser } from "../models/userModel.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  // Check if user exists
  const userExists = await userByEmail(email);

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await createUser({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await userByEmail(email);

  if (user && (await bcrypt.compare(password, user.password))) {
    res
      .cookie("access_token", generateToken(user._id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .json({
        _id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

const identifyUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    _id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
  });
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export { registerUser, loginUser, logoutUser, identifyUser };
