const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

const authenticateToken = require('../helper/authenticateToken');

//var cookieParser = require('cookie-parser');

//get events
router.get('/getEvents', authenticateToken, async (req, res) =>{
    let eventList = (await User.findById(req.user.userId)).events;
    
    if(!eventList){
        res.status(500).json({success: false});
    } 
    res.status(200).send(eventList);
})
//test cookie
router.get('/test', authenticateToken, async(req, res)=>{
    console.log("we in test api")
    // getCookies(function(err,res){
    //     if(!err){
    //         console.log(res);
    //     }
    // })
    console.log('Cookies: ', req.cookies['api-auth'])
    res.status(200).send("success")
})
//get event
router.get('/getEventById', authenticateToken, async (req, res) =>{
    const event = (await User.findById(req.user.userId)).events.find(req.body.eventId);
    if(!event){
        res.status(500).json({success: false});
    } 
    res.status(200).send(event);
})
//get mood history
router.get('/getMoodRecord', authenticateToken, async (req, res) =>{
    let moodRecord = (await User.findById(req.user.userId)).moodRecord;
    
    if(!moodRecord){
        res.status(500).json({success: false});
    } 
    res.status(200).send(moodRecord);
})
// gets user info
router.get('/userInfo', authenticateToken, async (req, res) =>{
    const user = await User.findById(req.user.userId).select('-passwordHash -isAdmin -_id -__v');
    if(!user){
        return res.sendStatus(500).json({message: 'The user with this ID was not found!'});
    } 
    return res.send(user);
})
//add event 
router.post('/addEvent', authenticateToken, async (req, res) =>{
    
    const user = await User.findById(req.user.userId)
    //console.log(user.events.find({title: 'Event 1'}))
    console.log(req.user.username)
    user.events.push({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
        offset: req.body.offset
    })
    await user.save()

    if(!user){
        return res.status(400).json({success: false})
    }
    return res.status(200).json({success: true});
})
//add mood
router.post('/addMood', authenticateToken, async (req, res) =>{
    const user = await User.findById(req.user.userId)
    //console.log(user.events.find({title: 'Event 1'}))
    user.moodRecord.push({
        mood: req.body.mood,
        date: req.body.date
    })
    await user.save()

    if(!user){
        return res.status(400).json({success: false})
    }
    return res.status(200).json({success: true});
})
//remove event
router.post('/deleteEvent', authenticateToken, async (req, res) =>{
    
    const user = await User.findById(req.user.userId)
    user.events.pull({
        _id: req.body.eventId
    })
    await user.save()
    
    if(!user){
        return res.status(400).json({success: false})
    }
    return res.status(200).json({success: true});
})
//edit event
router.patch('/editEventById', authenticateToken, async (req, res) =>{
    let event = (await User.findById(req.user.userId)).events.find(req.body.eventId);
    event = {
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        time: req.body.time,
        offset: req.body.offset
    }
    await event.save()
    if(!event){
        res.status(500).json({success: false});
    } 
    res.status(200).json({success: true});
})


module.exports = router;
