import mongoose from "mongoose";

// const uri = 'mongodb://'+process.env.DB_HOST+'/'+process.env.DB_NAME;
const uri = 'mongodb://localhost:27017/time_recording';

const options = {};

export const connection = mongoose.createConnection(uri, options);

// Notifications
connection.on('connected', function () {
    console.log('Mongoose connected to Mongo database landingpage on Host: ' + uri);
});

connection.on('disconnected', function (error) {
    console.log('Mongoose connection disconnectd on landingpage on Host: ' + uri);
});

connection.on('reconnect', function (ref) {
    console.log('reconnect to mongo server.');
});

connection.on('error', function (err) {
    console.log('error connection to mongo server!');
});
