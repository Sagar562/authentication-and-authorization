const express = require('express');
const router = express.Router();

const {logIn ,signUp} = require('../controllers/auth');
//middleware

const {auth, isStudent, isAdmin} = require('../middleware/middlewareAuth');


router.get('/test', auth,(req, res) => {
    res.status(200).json({
        success : true,
        message : 'test route successully'
    })
})
router.get('/student', auth, isStudent, (req, res) => {
    res.status(200).json({
        success : true,
        message : 'Student Route is protected'
    })
})
router.get('/admin', auth, isAdmin, (req, res) => {
    res.status(200).json({
        success : true,
        message : 'Admin Router is protected'
    })
})


router.post('/login', logIn);
router.post('/signup', signUp);

//protected routes


module.exports = router;