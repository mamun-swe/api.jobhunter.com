
// Profile Index of seeker
const Index = async (req, res, next) => {
    try {
        res.send("Seeker profile")
    } catch (error) {
        if (error) next(error)
    }
}

module.exports = {
    Index
}