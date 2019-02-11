const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return  res.status(401).send('Access denied, no token found !!');
    try {
        const decode = jwt.verify(token, config.get('privateJWT'));
        req.user = decode;
        next();
    } catch (error) {
        res.status(400).send('Invalid token !!')
    }
}

