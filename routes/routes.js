const express = require('express')
const router = express.Router()
const Blog = require('../model/Blog')
const mongoose = require('mongoose')
const {v4:uuidv4} = require('uuid')
const { getDateTime } = require('../extras/misc')


mongoose.connect('mongodb://127.0.0.1:27017/blogz').then((msg) => {
    console.log('Connected to database: Blogz')
}).catch((err) => {
    console.log('Error connecting to database: Blogz', err)
})

router.get('/blogs',async (req, res)=>{
    try {
        const blogs = await Blog.find()
        res.json({all_blogs: blogs})
    } catch (error) {
        res.json({error: error})
    }
})

router.get('/blog/:id', async (req, res)=>{
    const {id} = req.params
    try {
        const blog = await Blog.findOne({blogId: id})
        res.json({blog: blog})
    } catch (error) {
        res.json(error)
    }
})

router.get('/blogs/:userid', async (req, res)=>{
    const {userid} = req.params
    try {
        const blogs = await Blog.find({user: userid})
        res.json(blogs)
    } catch (error) {
        res.json(error)
    }
})

router.post('/add-new', async (req, res)=>{
    const {userID, title, category, text} = req.body    
    try {
        await Blog.create({
            blogId: uuidv4(),
            title: title,
            category: category,
            text: text,
            marked: text,
            user: userID,
            date_posted: getDateTime()
        })
        res.json({success: 'post created'})
    } catch (error) {
        res.json({error: error.message})
    }
})

router.get('/search/:q', async (req, res)=>{
    const {q} = req.params
    try {
        const blogs = await Blog.find({ text: { $regex: `(?i)${q}*` }})
        res.json(blogs)
    } catch (error) {
        res.json({error: error.message})
    }
})

router.post('/update/:blogId', async (req, res)=>{
    const {blogId} = req.params
    const {title, category, text} = req.body
    try {
        console.log(title, category, text)
        await Blog.updateOne({blogId: blogId}, {$set: {title: title, category: category, text: text}})
        .then((msg) => {
            console.log('done')
            res.json({success: true})
        })
    } catch (error) {
        console.log('failed', error)
        res.json({error: error.message})
    }
})

router.delete('/delete/:id', async (req, res)=>{
    const {id} = req.params
    await Blog.deleteOne({blogId: id})
    .then(() => {
        res.json({success: true})
    })
    .catch((error) => res.json({success: false}))
})

module.exports = router