const Message = require("../../../Models/Message")

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

module.exports = {
    Store,
    GetMessages
}