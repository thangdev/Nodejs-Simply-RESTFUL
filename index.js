
const config = require('config')
const joi = require('joi');
require('express-async-errors')
//joi.objectId = require('joi-objectid')(joi)
const error = require('./middleware/error')
const login = require('./routes/login')
const users = require('./routes/users');
const mongoose = require('mongoose')
const express = require('express')
const app = express();

process.on('uncaughException', (ex) => {
    console.log('server got an uncaugh exception ', ex)
    process.exit(1)
})

if(!config.get('privateJWT')){
    console.log('FATAL: privateJWT is not defined.');
    process.exit(1);
}

console.log(process.env)
mongoose.connect('mongodb://localhost/users',{ useNewUrlParser: true })
    .then(() => console.log('Connected to mongoDB...'))
    .catch(err => console.log('Could not connect to mongoDB...', + err.message))

app.use(express.json())
app.use('/api/users', users)
app.use('/api/login', login)
app.use(error)

const port = process.env.PORT||4000;
app.listen(port,() => console.log(`Listening on port ${port}...`));
