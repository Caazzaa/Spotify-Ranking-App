const mongoose = require('mongoose')
const {Schema, SchemaTypes} = mongoose

const userSchema = new Schema({
    username: String,
    email: {
        type: String,
        unique: true
    },
    password: String
})

const UserModel = mongoose.model('User', userSchema)

module.exports = UserModel