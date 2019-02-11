const _ = require('lodash')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
require('express-async-errors')
const jwt = require('jsonwebtoken');
const config = require('config')
const bcrypt = require('bcrypt')
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express')
const router = express.Router();

router.get('/me',auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.send(user);
    } catch (error) {
        res.send(error);
    }
})


router.get('/', async (req, res) => {
    const listUser = await User.find();
    res.send(listUser)
});

router.put('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return  res.status(404).send('User not found !!');
    user.name = req.body.name;
    const result = await user.save()
    res.send(user);

});

router.post('/', async (req, res) => {// register new user account
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered !!');
    try {
        user = new User(_.pick(req.body, ['name', 'email', 'password']))
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        const token = user.generateAuthToken();
        res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']))    
    } catch (error) {
        res.send(error)
    }
});

router.delete('/:id', [auth, admin], async (req, res) =>{
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send('The user with the given ID not found ');
    const userDeleted = await User.findByIdAndDelete(req.params.id)
    res.send(userDeleted)
});

module.exports = router;
