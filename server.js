const express = require('express');
const app = express();
const dotenv = require('dotenv');
const basicAuth = require('express-basic-auth')
const cors = require('cors')
const {
    join
} = require('path')
const mongoose = require('mongoose');
const userdb = require('./src/services/models/users/index')
const userServices = require('./src/services/users/index');
const postRouter = require('./src/services/posts/')
dotenv.config();

const PORT = process.env.PORT || 4000

app.use(express.json())
app.use(cors())

app.use(basicAuth({
    unauthorizedResponse: getUnauthorizedResponse,
    challenge: true,
    authorizer: myAsyncAuthorizer,
    authorizeAsync: true
}))

function getUnauthorizedResponse  (req){
    return req.auth ?
        ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected') :
        'No credentials provided'
}

async function myAsyncAuthorizer (user, pass, cb){
    let result = await userdb.find({username: user})
    if (user === result[0].username && pass === result[0].password)
        return cb(null, true)
    else
        return cb(null, false)
}

app.use("/post", express.static(join(__dirname, './public/posts/')))
app.use('/users', userServices);
app.use('/posts', postRouter)

app.listen(PORT, () => {
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