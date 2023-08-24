const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Model = mongoose.model
const bcrypt = require("bcrypt")
const validator = require("validator")


const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    favourites: [{ quote: { type: String }, author: { type: String }, date: { type: Date, default: Date.now() } }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }]

}, { timestamps: true })


UserSchema.statics.signup = async function (name, email, password) {
    if (!name || !email || !password) {
        throw Error("Fill all Fields!!")
    }

    const exists = await this.findOne({ email })

    if (exists || exists !== null) {
        throw Error("Email Already in Use!")
    }

    if (!validator.isEmail(email)) {
        throw Error("Email is not Valid!")
    }


    const salt = await bcrypt.genSalt(3)
    const hash = await bcrypt.hash(password, salt)
    const User = await new this({ name, email, password: hash })
    await User.save()


    return User
}


UserSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("Please Fill All Fields!!!")
    }

    const user = await this.findOne({ email })
    if (!user) {
        throw Error("Incorrect Email!")

    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        throw Error("Incorrect Password!")
    }

    return user
}




module.exports = Model("User", UserSchema)