const express = require('express');
const app = express();
const dotenv = require ('dotenv');
const cors = require('cors')
const {join} = require('path')
const mongoose = require('mongoose');
const userServices = require('./src/services/users/index');
const postRouter = require('./src/services/posts/')
dotenv.config();

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
app.use("/posts", express.static(join(__dirname, './public/posts/')))
app.use('/users', userServices);
app.use('/api/posts', postRouter)

app.listen(PORT ,()=>{
    console.log(`server active on port ${PORT}`);

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
})