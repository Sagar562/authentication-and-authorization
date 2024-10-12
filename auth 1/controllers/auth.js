const bcrypt = require('bcryptjs');
const User = require('../modules/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.signUp = async(req, res) => {

    try {
        const {name, email, password, role} = req.body;
        //check for alread login user
        const checkUser = await User.findOne({email});

        if (checkUser) {
            return res.status(400).json({
                success : false,
                message : 'User already exists'
            })
        }
        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, 10);
        }
        catch(error) {
            return res.status(500).json({
                success : false,
                message : 'error while password hashing'
            })
        }
        //create user entry
        const user = await User.create({
            name,
            email,
            password : hashPassword,
            role,
        })
        return res.status(200).json({
            success : true,
            message : 'User created Successfully'
        })
    }
    catch(error) {
        console.error(error);
        res.status(500).json({
            success : false,
            message : 'User canonot created'
        })
    }

}

exports.logIn = async(req, res) => {

    try {
        const {email, password} = req.body;

        if (!email || !password) {
            console.error(error);
            return res.status(400).json({
                success : false,
                message : 'user not send details',
            })
        }
        //check if user is signUp or not
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).json({
                success : false,
                message : 'User not sign up'
            })
        }
        const payload = {
            email : user.email,
            id : user._id,
            role : user.role
        }

        if (await bcrypt.compare(password, user.password)) {
            //password match
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn : '2h',
                                });
             
            // console.log(token);
            user.token = token;
            // console.log(user.token);
            // console.log(user);
            user.password = undefined;
            
            res.cookie("setCookie", token).status(200).json({
                success : true,
                token,
                user,
                message : 'Log in Successul'
            })
            }

    }
    catch(error) {
        res.status(500).json({
            success : false,
            message : 'server problem'
        })

    }
}