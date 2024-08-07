const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async(req, res, next) => {

    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            // get token from header
            // syntax - Bearer token
            token = req.headers.authorization.split(' ')[1] // returns just the token

            // verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // get user from token
            req.user = await User.findById(decoded.id).select('-password');

            next();
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error("not authorised")
        }
    }

    if(!token){
        res.status(401);
        throw new Error("not authorised. no token");
    }
});

module.exports = {protect}