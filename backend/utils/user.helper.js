import User from "../models/userModel.js";

export const userById = (id) => User.findById(id);

export const userByEmail = (email) => User.findOne({ email });

export const createUser = (data) => User.create(data);
