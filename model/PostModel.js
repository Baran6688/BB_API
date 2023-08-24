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

PostSchema.statics.findDelete = async function (postId, UserId) {
    const post = await this.findByIdAndDelete(postId)
    const AuthorId = post.author._id



    if (!UserId.equals(AuthorId)) { throw Error("You are not Authorized!") }
    const user = await User.findByIdAndUpdate(AuthorId, { $pull: { posts: postId } })
    await user.save()


}






module.exports = Model("Post", PostSchema)