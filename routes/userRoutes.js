const express = require('express')
const router = express.Router()
const {v4:uuidv4} = require('uuid')
const User = require('../model/User')
const mongoose = require('mongoose')
const crypto = require('crypto')
const {getDateTime} = require('../extras/misc')

mongoose.connect('mongodb://127.0.0.1:27017/blogz').then((msg) => {
    // console.log('Connected to database: Blogz')
}).catch((err) => {
    console.log('Error connecting to database: Blogz', err)
})

router.post('/login', async (req, res)=>{
    let {username, password} = req.body
    password = crypto.createHash('sha256').update(password).digest('hex')
    try {
        const user = await User.findOne({username: username, password: password})
        if(user){
            res.json({user: user, success:true})
        }else{
            res.json({user: null, success:false})
        }
    } catch (error) {
        res.json({error: error, success: false})
    }
})

router.post('/register', async (req, res)=>{
    const {name, username, email, password} = req.body
    const passwd = crypto.createHash('sha256').update(password).digest('hex')
    try {
        await User.create({
            userId: uuidv4(),
            name: name,
            username: username,
            email: email,
            password: passwd,
            join_date: getDateTime()
        })
        res.json({message: 'success'})
    } catch (error) {
        res.json({message: 'error', error: error})
    }
})

router.get('/:id', async (req, res)=>{
    const {id} = req.params
    try {
        const user = await User.findOne({username: id})
        res.json(user)
    } catch (error) {
        console.log(error)
    }
})

router.post('/check', async (req, res)=>{
    const {userId, password} = req.body
    const passwd = crypto.createHash('sha256').update(password).digest('hex')
    try {
        const user = await User.findOne({username: userId, password: passwd})
        user?res.json({success:true}):res.json({success:false})
    } catch (error) {
        res.json(error)
    }
})

router.post('/change-password', async (req, res)=>{
    const {password, user} = req.body
    const passwd = crypto.createHash('sha256').update(password).digest('hex')
    try {
        await User.updateOne({ username: user }, { $set: { password: passwd } })
        .then((msg) => console.log(msg))
        res.send({success: 'password changed successfully'})
    } catch (error) {
        res.json({error: error.message})
    }
})

module.exports = router