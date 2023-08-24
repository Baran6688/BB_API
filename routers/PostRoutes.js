const express = require("express")
const requireAuth = require("../middlewares/requireAuth")
const router = express.Router()
const Post = require("../model/PostModel")
const mongoose = require("mongoose")


router.get("/", async (req, res) => {
    const posts = await Post.find({}).populate("author", "name")
    console.log(posts)
    res.status(200).json(posts)
})


router.post("/", requireAuth, async (req, res) => {
    const { text } = req.body
    const UserId = req.user._id

    try {
        const post = await Post.newpost(UserId, text)
        res.status(200).json(post)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete("/:id", requireAuth, async (req, res) => {
    const { id } = req.params
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) { throw Error("Post Does not Exist!") }

        const post = await Post.findById(id)
        const UserId = req.user._id
        const AuthorId = post.author._id

        if (!UserId.equals(AuthorId)) { throw Error("You are not Authorized!") }

        await Post.findOneAndDelete(id)
        res.status(200).json({ Message: "Post Deleted" })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }

})




module.exports = router