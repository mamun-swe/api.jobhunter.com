const mongoose = require('mongoose')

module.exports = id => {
    if (!mongoose.isValidObjectId(id)) {
        let error = new Error()
        error.status = 400
        throw error
    }
}