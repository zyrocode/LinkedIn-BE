require("dotenv").config();
var mongoose = require("mongoose");

const connectMongoose = () => {
    mongoose
        .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        })
        .then(
            () => {
                console.log("Connected to MongoDB!");
            },
            err => {
                console.log(err.reason);
            }
        );
};

module.exports = connectMongoose;