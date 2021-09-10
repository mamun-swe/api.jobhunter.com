
const Store = user => {
    let error = {}

    if (!user.jobId) error.jobId = "Job ID is required"
    if (!user.rating) error.rating = "Rating is required"

    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = { Store }