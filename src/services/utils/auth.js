const UserModel = require("../models/users")
const LocalStrategy = require("passport-local")
const JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt
const passport = require("passport")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN_PASSWORD
}

passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

passport.use(new LocalStrategy(UserModel.authenticate()))
passport.use(new JwtStrategy(jwtOptions, (jwtPayload, callback) => {
    UserModel.findById(jwtPayload._id, (exx, user) => {
        if (exx) return callback(exx, false)
        else if (user) return callback(null, user)
        else return callback(null, false)
    })
}))

module.exports = {
    getToken: (user) => jwt.sign(user, jwtOptions.secretOrKey, {
        expiresIn: 3600
    })
}