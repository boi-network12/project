const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
        console.log('Decoded token:', decoded); // Log the decoded token
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Token verification failed:', err); // Log the error
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = verifyToken;
