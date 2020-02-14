const mongoose = require('mongoose')
const passportLocalMongoose = require("passport-local-mongoose")

const experienceSchema = new mongoose.Schema({
    role:{
        type:String,
        maxlength: 20,
        required:true
    },
    company:{
        type:String,
        maxlength: 20,
        required:true
    },
    startDate:{
        type: Date,
    },
    endDate:{
        type: Date
    },
    description:{
        type: String,
        minlength: 5,
        maxlength: 250
    },
    area:{
        type: String,
        required: true
    },
    image:{
        type: String,
        default: "http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder.png"
    }
},{timestamps: true})

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username:{
        type:String,
        minlength:4,
        required: true,
        unique:true
    },
    title:{
        type: String
    },
    area:{
        type: String
    },
    bio:{
        type: String
    },
    experience: [experienceSchema],
    image:{
        type: String,
        default: "https://www.shareicon.net/data/512x512/2015/10/02/649910_user_512x512.png"
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "User"
    },
    refreshToken: String,
}, {
    timestamps: true
})

const userSchemas = new mongoose.Schema({
    role: String,
    facebookId: String,
    firstName: String,
    lastName: String,
    avatar: String,
    refreshToken: String,
    gitHubId: String
})

userSchemas.plugin(passportLocalMongoose)

module.exports = mongoose.model('users', userSchemas)

