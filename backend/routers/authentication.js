const {User} = require('../models/user');
const {RefreshToken} = require('../models/refreshToken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// checks is user exist
router.get('/validateUser', async (req, res) =>{
    return isUserValid(req.body.username)
})
// Register User
router.post('/register', async (req, res) =>{
    if(!isUserValid(req.body.username)) return res.status(400).send({success: false})

    let user = new User({
        username: req.body.username,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })

    user = await user.save();

    if(!user){
        return res.status(400).send({success: false})
    }
    return res.send({success: true});
})
// Authenticate users credentials 
router.post('/login', async (req, res) =>{
    const user = await User.findOne({username: req.body.username});

    if(!user){
        return res.status(400).send({success: false, issue:'username'});
    }
    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)){
        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(
            {
                userId: user.id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '30s'}
        );
        //Add refresh token to the database
        let newRefreshToken = new RefreshToken({
            refreshToken: refreshToken
        })
        newRefreshToken = await newRefreshToken.save();

        return res.status(200).send({success: true, accessToken: accessToken, refreshToken: refreshToken});
    }else{
        return res.status(400).send({success: false, issue:'password'})
    }
})
// Request new access token
router.post('/token', async (req,res) =>{
    const refreshToken = req.body.token
    if(refreshToken == null) return res.sendStatus(401).json({success: false})
    //Chech if refresh token database has refresh token
    const refreshTokenStatus = await RefreshToken.findOne({refreshToken: refreshToken})
    if(!refreshTokenStatus) return res.sendStatus(403).json({success: false})

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) =>{
        if(err){
            await RefreshToken.deleteOne({refreshToken: refreshToken})
            return res.sendStatus(403).json({success: false})
        }
        const accessToken = generateAccessToken({name: user.name})
        res.json({success: true, accessToken: accessToken})
    })
})
// Delete refresh token
router.delete('/logout', async (req,res) =>{
    // Delete token from list
    const token = await RefreshToken.deleteOne({refreshToken: req.body.refreshToken})
    if(!token) return res.sendStatus(401) 
    
    return res.sendStatus(204)
})
function generateAccessToken(user){
    return jwt.sign(
        {userId: user.id}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30m'}
    );
}
async function isUserValid(username){
    const isUserValid = await User.findOne({username: username});
    
    if(!isUserValid){
        return res.send(false);
    } 
    return res.send(true);
}

module.exports = router;