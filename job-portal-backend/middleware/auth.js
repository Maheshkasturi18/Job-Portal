const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: role not authorized' });
        }
        next();
    };
}

exports.authenticateToken = authenticateToken;
exports.authorizeRoles = authorizeRoles;