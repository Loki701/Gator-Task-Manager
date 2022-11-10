const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticateToken = require('../helper/authenticateToken');

//build- make this a get user Eventlist will authenticated
router.get('/', async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false});
    } 
    res.send(userList);
})
//build- add event to user EventList will authenticated
//build- remove event from user EventList will authenticated
//build- edit event from user EventList will authenticated

// checks is user exist
router.get('/validateUser', async (req, res) =>{
    const isUserValid = await User.findOne({username: req.body.username});
    
    if(!isUserValid){
        return res.send(false);
    } 
    return res.send(true);
})
// gets user info with id
router.get('/:id', authenticateToken, async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message: 'The user with this ID was not found!'});
    } 
    res.status(200).send(user);
})
// signup user
router.post('/register', async (req, res) =>{
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })

    user = await user.save();

    if(!user){
        return res.status(400).send({success: false});
    }
    return res.send({success: true});
})
// authenticate users credentials 
router.post('/login', async (req, res) =>{
    const user = await User.findOne({username: req.body.username});

    if(!user){
        return res.status(400).send({success: false, issue:'username'});
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const accessToken = jwt.sign({username: user.username}, process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '1800s'}
        );
        const refreshToken = jwt.sign(
            {
                userId: user.id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'}
        );
        //saving refreshToken with current user
        //const otherUsers = User.find(!{username: req.body.username});
        //const currentUser = 


        return res.status(200).send({success: true, issue:'none', user: user.username, token: accessToken});
    }else{
        return res.status(400).send({success: false, issue:'password'})
    }
})

module.exports = router;
