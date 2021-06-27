const { Schema, model } = require("mongoose")

const commentSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    comment: {
        type: String,
        trim: true,
        required: true
    },

}, {
    timestamps: true
})


const Comments = model("Comments", commentSchema)
module.exports = Comments
