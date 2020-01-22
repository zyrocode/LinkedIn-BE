const mongoose = require('mongoose');

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
    username:{
        type: String,
        minlength:5,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    image:{
        type: String
    }
})

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
    bio:{
        type: String,
    },
    experience: [experienceSchema],
    image:{
        type: String,
        default: "https://soulcore.com/wp-content/uploads/2018/01/profile-placeholder.png"
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    updatedAt:{
        type: Date,
        default: Date.now()
    },
}, {
    timestamps: true
})

const userCollection = mongoose.model('user', userSchema,'users');
module.exports = userCollection;