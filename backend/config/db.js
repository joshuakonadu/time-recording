import mongoose from "mongoose";

// const uri = 'mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME;
const uri = 'mongodb://localhost:27017/time_recording';

const options = {};

export const connection = mongoose.connect(uri, options);

