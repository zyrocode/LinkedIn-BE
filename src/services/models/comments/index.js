const {Schema } = require('mongoose')

const commentsShema = new Schema({
    user: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    post: {
        type: Schema.Types.ObjectId
    }
}, {
    timestamps: true
})


module.exports = commentsShema