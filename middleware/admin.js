module.exports = (req, res, next) => {
    // 401: Unauthorized :client dont have valid jwt to get resource
    // 403: Forbidden : jwt đúng nhưng jwt này ko có permisson truy cập/control resource
    if(!req.user.isAdmin) return res.status(403).send('Access Denied !! You are not admin')
    next();
} 