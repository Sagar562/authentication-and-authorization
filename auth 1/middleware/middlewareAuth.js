//auth , isStudent, isAdmin
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.auth = (req, res, next) => {

    try {
        const token = req.body.token;

        if (!token) {
            res.status(401).json({
                success : false,
                message : 'token Missing'
            })
        }
        //variy the token
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            console.log(payload);
            req.user = payload; //to store payload in req.user

            next();
        }catch(error) {
            return res.status(401).json({
                success : false,
                message : 'not valid token'
            })
        }
    } catch(error) {
        res.status(401).json({
            success : false,
            message : 'somethig went wrong'
        })
    }
}

exports.isStudent = (req, res, next) => {
    try {
        if (req.user.role !== 'Student') {
            return res.status(401).json({
                success : false,
                message : 'role not matched for Student'
            })
        }
        next();
    } catch(error) {
        res.status(500).json({
            success : false,
            message : 'Internal server problem'
        })
    }
}
exports.isAdmin = (req, res, next) => {
    
    try {
        if (req.user.role !== 'Admin') {
            return res.status(401).json({
                success : false,
                message : 'role not matched for Admin'
            })
        }
        next();
    } catch(error) {
        res.status(500).json({
            success : false,
            message : 'Internal server problem at Admin'
        })
    }
}