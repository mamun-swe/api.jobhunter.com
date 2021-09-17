const Users = require("../../../Models/User")
const Message = require("../../../Models/Message")
const { Host } = require("../../Helpers/_helpers")

// Store message
const Store = async (data, room) => {
    try {
        const { author, to, message } = data

        const newMessage = new Message({
            author,
            to,
            roomId: room,
            text: message
        })

        await newMessage.save()
        return true
    } catch (error) {
        if (error) return error
    }
}

// Get all message
const GetMessages = async (req, res, next) => {
    try {
        const messages = []
        const { author, to } = req.params

        const results = await Message.find({
            $or: [
                { $and: [{ author: author }, { to: to }] },
                { $and: [{ author: to }, { to: author }] }
            ]
        })

        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]
                messages.push({
                    author: element.author == author ? "me" : null,
                    type: "text",
                    data: { text: element.text }
                })
            }
        }

        res.status(200).json({
            status: true,
            messages
        })
    } catch (error) {
        if (error) next(error)
    }
}

// Get all users
const AllUsers = async (req, res, next) => {
    try {

        const users = []
        const results = await Users.find(
            { _id: { $ne: req.user._id } },
            { name: 1, image: 1 }
        )
            .sort({ name: 1 })
            .exec()

        if (results && results.length) {
            for (let i = 0; i < results.length; i++) {
                const element = results[i]
                users.push({
                    _id: element._id,
                    name: element.name,
                    image: element.image ? Host(req) + "uploads/users/" + element.image : null
                })
            }
        }

        res.status(200).json({
            status: false,
            data: users
        })
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Store,
    GetMessages,
    AllUsers
}