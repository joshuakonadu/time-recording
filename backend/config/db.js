import mongoose from "mongoose";

// const uri = 'mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME;
const uri = "mongodb://127.0.0.1/time_recording?authSource=admin";

const options = {};

export const connection = mongoose.connect(uri, options);
