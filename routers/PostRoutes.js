const express = require("express")
const requireAuth = require("../middlewares/requireAuth")
const router = express.Router()
const Post = require("../model/PostModel")
const mongoose = require("mongoose")


router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({}).populate("author", "name email").sort({ "createdAt": -1 })
        res.status(200).json(posts)
    } catch (error) {
        res.status.json({ error: error.message })
    }

})


router.post("/", requireAuth, async (req, res) => {
    const { text } = req.body
    const UserId = req.user._id

    try {
        if (text.length <= 0) {
            throw Error("Fill the Field")
        }

        const post = await Post.newpost(UserId, text)
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params
    const UserId = req.user._id
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) { throw Error("Post Does not Exist!") }
        const post = await Post.findDelete(id, UserId)
        res.status(200).json({ message: "Post Deleted" })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})




module.exports = router