const express = require('express')
const app = express()
const host = 'localhost' //'192.168.0.19'
const port = 4000
const routes = require('./routes/routes')
const userRoutes = require('./routes/userRoutes')
const cors = require('cors')
const mongoose = require('mongoose')

app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(routes)
app.use('/user/', userRoutes)

app.get('/', (req, res)=>{
    res.json({success: 'server running :)'})
})

app.listen(port, host, ()=>{
    console.log(`server running at http://${host}:${port}`)
})