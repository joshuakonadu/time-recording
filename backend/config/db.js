import mongoose from "mongoose";

// const uri = 'mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME;
const uri = process.env.MONGO_URI || "mongodb://127.0.0.1/time_recording";

const options = {};

export const connection = mongoose.connect(uri, options);
