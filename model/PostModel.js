const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model
const validator = require("validator")
const User = require("./UserModel")


const PostSchema = new Schema({
    author: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
}, { timestamps: true })


PostSchema.statics.newpost = async function (UserId, text) {
    //Creating New Post
    const post = await new this({ author: UserId, text })
    await post.save()

    //Passing the Post to User
    const author = await User.findByIdAndUpdate(UserId, { $push: { posts: post._id } })
    await author.save()

    return post
}



PostSchema.post("findOneAndDelete", async function (post) {
    //Deleting the Post from User's Schema
    const user = await User.findByIdAndUpdate(post.author._id, { $pull: { posts: post._id } })
    await user.save()
})


module.exports = Model("Post", PostSchema)