const express = require('express');
const app = express();
const dotenv = require('dotenv');
const cors = require("cors");
const mongoose = require('mongoose');
const userServices = require('./src/services/users/index');
dotenv.config();

const whitelist = ["http://localhost:3000"];
var corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    }
};

mongoose.connect("mongodb://127.0.0.1:27017/linkedindb", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true
    })
    .then(db => {
            console.log('mongoose db is live')
        },
        err => console.log('mongoose db failed to connect', err))


app.use(express.json());
app.use('/users', cors(corsOptions),userServices);
app.listen(process.env.PORT, () => {
    console.log(`server active on port ${process.env.PORT}`);
})