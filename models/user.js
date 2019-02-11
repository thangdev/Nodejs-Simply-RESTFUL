const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const joi = require('joi');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required : true,
        minlength : 5,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
        minlength: 5
    },
    password: {
        type: String,
        required: true,
        maxlength: 1024,
        minlength: 5
    },
    isAdmin : Boolean

});

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({id: this._id, isAdmin: this.isAdmin}, config.get('privateJWT'))// secretkey chua trong file config
    return token;
}
const User = mongoose.model('User', userSchema)

const validateUser = user => {
    const schema = {
        name: joi.string().min(5).max(200).required(),
        email: joi.string().min(5).max(200).required(),
        password : joi.string().min(5).max(255).required()
    }
    return joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;