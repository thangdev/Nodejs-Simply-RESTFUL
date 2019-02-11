const _ = require('lodash')
const joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();
// check login (valid email and password) ? send back to client a jwt : return 400 code 
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    // check valid email
    let user = await User.findOne({email: req.body.email})
    if(!user) return res.status(400).send('Invalid email or password !!');
    // check valid password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword)  return res.status(400).send('Invalid email or password !!');
    // gen token and send back to client
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send("logined successfully")

})

const validate = req => {
    const schema = {
        email: joi.string().min(5).max(200).required(),
        password : joi.string().min(5).max(255).required()
    }
    return joi.validate(req, schema);
}

module.exports = router;
