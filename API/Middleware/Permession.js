const jwt = require('jsonwebtoken')

const Company = async (req, res, next) => {
    try {
        const token = await req.headers.authorization
        if (!token) return res.status(404).json({ message: 'Token not found' })

        // decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)

        // check role
        if (decode.role === 'company') {
            req.user = decode
            next()

        } else {
            return res.status(401).json({ message: 'You have no permissions to access' })
        }

    } catch (error) {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(410).json({ message: 'Token expired' })
            }
            return res.status(501).json({ message: 'unauthorized request' })
        }
    }
}

const Seeker = async (req, res, next) => {
    try {
        const token = await req.headers.authorization;
        if (!token) return res.status(404).json({ message: 'Token not found' })

        // decode token
        const splitToken = await req.headers.authorization.split(' ')[1]
        const decode = await jwt.verify(splitToken, process.env.JWT_SECRET)

        // check role
        if (decode.role === 'seeker') {
            req.user = decode
            next()

        } else {
            return res.status(401).json({ message: 'You have no permissions to access' })
        }

    } catch (error) {
        if (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(410).json({ message: 'Token expired' })
            }
            return res.status(501).json({ message: 'unauthorized request' })
        }
    }
}

module.exports = {
    Company,
    Seeker
}
