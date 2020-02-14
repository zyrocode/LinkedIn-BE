const express = require('express')
const server = express()
const cors = require('cors')
const listEndPoints = require("express-list-endpoints")
const passport = require("passport")
const userRouter = require('./src/services/routes/users')
const postRouter = require('./src/services/routes/posts')
const authRouter = require('./src/services/routes/auth')
const connectMongoose = require("./src/services/db/mongoose")
const {
    join
} = require('path')
require('dotenv').config();

const PORT = process.env.PORT || 4000

server.use(express.json())
server.use(cors())
server.use(passport.initialize())

server.get("/", passport.authenticate("local"), (req, res) => {
    res.send("Up and running!")
})
server.use("/post", express.static(join(__dirname, './public/posts/')))
server.use('/users', userRouter)
server.use('/posts', postRouter)
server.use('/auth', authRouter)


console.log(listEndPoints(server))

server.listen(PORT, () => {
    console.log(`Server active on port ${PORT}`)
    const whitelist = ["http://localhost:3000"]
    connectMongoose()
    var corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1 || !origin) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        }
    }
})