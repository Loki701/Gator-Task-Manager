const {User} = require('../models/user');
const {RefreshToken} = require('../models/refreshToken');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');

// checks is user exist in the database
router.get('/validateUser', async (req, res) =>{
    return isUserValid(req.body.username)
})
// Register User/ add user credential to the database including hashed password 
router.post('/register', async (req, res) =>{
   
    if(!isUserValid(req.body.username)) return res.status(400).send({success: false})

    let user = new User({
        username: req.body.username,
        passwordHash: bcrypt.hashSync(req.body.password, 10)
    })

    user = await user.save();

    if(!user){
        return res.status(400).send({success: false})
    }
    return res.status(200).send({success: true});
})
// Authenticate users credentials and create a cookie on the client side storing the token needed to make api calls
router.post('/login', async (req, res) =>{
    let usr = req.body.username.toString();
    const user = await User.findOne({username: usr});

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
        //newRefreshToken = await newRefreshToken.save();

        //create cookie
        res.cookie("api-auth", accessToken, {
            secure: true,
            httpOnly: true,
            expires: dayjs().add(7, "days").toDate()
        });
        console.log("creating cookie!");

        return res.status(200).send({success: true});
    }else{
        return res.status(400).send({success: false, issue:'password'})
    }
})
// Request new access token if the user has a valid refresh token
router.post('/token', async (req,res) =>{
    const refreshToken = (req.body.token).toString();
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
    const token = await RefreshToken.deleteOne({refreshToken: req.body.refreshToken.toString()})
    if(!token) return res.sendStatus(401) 
    
    return res.sendStatus(204)
})
function generateAccessToken(user){
    return jwt.sign(
        {userId: user.id}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '2h'}
    );
}
async function isUserValid(username){
    const isUserValid = await User.findOne({username: username.toString()});
    console.log(isUserValid)
    if(!isUserValid){
        return false;
    } 
    return true;
}

module.exports = router;