const {User} = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) =>{
    const userList = await User.find().select('-passwordHash');

    if(!userList){
        res.status(500).json({success: false});
    } 
    res.send(userList);
})
router.get('/emails', async (req, res) =>{
    const userList = await User.find().select('email');

    if(!userList){
        res.status(500).json({success: false});
    } 
    res.send(userList);
})
router.get('/:id', async (req, res) =>{
    const user = await User.findById(req.params.id).select('-passwordHash');

    if(!user){
        res.status(500).json({message: 'The user with this ID was not found!'});
    } 
    res.status(200).send(user);
})


router.post('/', async (req, res) =>{
    let user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
        isAdmin: req.body.isAdmin,
    })

    user = await user.save();

    if(!user){
        return res.status(400).send('The user cannot be created!')
    }
    res.send(user);
})

router.post('/login', async (req, res) =>{
    const user = await User.findOne({username: req.body.username});
    const secret = process.env.secret;

    if(!user){
        return res.status(400).send('The user not found!');
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const token = jwt.sign(
            {
                userId: user.id
            },
            secret,
            {expiresIn: '43200s'}
        );
        return res.status(200).send({user: user.username, token: token});
    }else{
        return res.status(400).send('Password is wrong!')
    }
})

module.exports = router;
