const jwt = require("jsonwebtoken")
const User = require("../model/UserModel")


const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ error: "Authorization Required!!" })
    }
    const token = authorization.split(" ")[1]

    try {
        const { _id } = jwt.verify(token, "SDFLKSJDJFKLSDJLKFJSLKDJ")
        req.user = await User.findById(_id).select("_id")
        next()

    } catch (error) {
        res.status(401).json({ error: "Request is not Authorized" })
    }
}

module.exports = requireAuth