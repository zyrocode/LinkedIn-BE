const {Schema ,model} = require('mongoose')

const postsShema = new Schema({
    text: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "http://lorempixel.com/400/200/"
    }
}, {
    timestamps: true
})

const postsCollection = model('posts', postsShema)

module.exports = postsCollection