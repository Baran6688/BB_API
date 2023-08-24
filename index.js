const express = require("express")
const app = express()
const mongoose = require('mongoose')



app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/bbquotes')
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











const port = 3000
app.listen(port, () => {
    console.log(`App Listening on Port ${port}`)
})