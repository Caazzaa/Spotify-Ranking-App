const mongoose = require('mongoose')
const {Schema, SchemaTypes} = mongoose

const ratingSchema = new Schema({
    userID: {
        type: SchemaTypes.ObjectID,
        ref: 'User',
        required: true,
    },
    albumID: {
        type: String,
        required: true,
    },
    review: {
        type: String,
    },
    rating: {
        type: Number,
    }
})

const RatingModel = mongoose.model('Rating', ratingSchema)

module.exports = RatingModel