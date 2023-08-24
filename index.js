const express = require("express")
const app = express()
const mongoose = require('mongoose')
require("dotenv").config()



app.use(express.json())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://svg-web.pages.dev');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Connected to MongoDB Successfully")
    })
    .catch((er) => {
        console.log("ERROR", er)
    })





app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})


const UserRoutes = require("./routers/userRoutes")
app.use("/api/user", UserRoutes)

const PostRoutes = require("./routers/PostRoutes")
app.use("/api/post", PostRoutes)











const port = 3000
app.listen(port, () => {
    console.log(`App Listening on Port ${port}`)
})