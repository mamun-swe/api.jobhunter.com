const { Schema, model } = require("mongoose")

const RatingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    job: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    rating: {
        type: Number,
        trim: true,
        required: true
    }
}, {
    timestamps: true
})


const Rating = model("Rating", RatingSchema)
module.exports = Rating
