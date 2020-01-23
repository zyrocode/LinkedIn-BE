const {Schema } = require('mongoose')

const likesShema = new Schema({
    user: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true
})


module.exports = likesShema