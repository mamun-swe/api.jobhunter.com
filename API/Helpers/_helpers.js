const fs = require("fs")
const generateUniqueId = require("generate-unique-id")
const nodemailer = require("nodemailer")

// Single file upload
const UploadFile = async (data, path) => {
    try {
        const image = data
        const extension = image.name.split('.')[1]

        const newName = Date.now() + '.' + extension
        uploadPath = path + newName
        const moveFile = image.mv(uploadPath)

        if (moveFile) return newName
    } catch (error) {
        if (error) return error
    }
}

// Delete file from directory
const DeleteFile = (destination, file) => {
    fs.unlink(destination + file, function (error) {
        if (error) return error
        return
    });
}

// Get Host URL
const Host = (req) => {
    // return req.protocol + '://' + req.get('host') + '/'
    return 'https://' + req.get('host') + '/'
}

// Unique code generate
const UniqueCode = async () => {
    try {
        const code = generateUniqueId({ length: 4, useLetters: false })
        return code

    } catch (error) {
        return error
    }
}

// Mail send
const SendEmail = async (data) => {
    try {
        // Mail transporter
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'instantjobinfo@gmail.com',
                pass: 'Instant90@'
            }
        })

        // send mail with defined transport object
        const mailService = await transporter.sendMail({
            from: data.from, // sender address
            to: data.to, // list of receivers
            subject: data.subject, // Subject line
            html: data.body // html body
        })

        if (!mailService) return false

        return true
    } catch (error) {
        if (error) return false
    }
}

// Rating calculator
const RatingCalculator = data => {
    let ratings

    if (data && data.length) {
        const one = data.filter(x => x.rating === 1).length
        const two = data.filter(x => x.rating === 2).length
        const three = data.filter(x => x.rating === 3).length
        const four = data.filter(x => x.rating === 4).length
        const five = data.filter(x => x.rating === 5).length
        ratings = [
            { rating: 1, total: one },
            { rating: 2, total: two },
            { rating: 3, total: three },
            { rating: 4, total: four },
            { rating: 5, total: five },
        ]
    }

    return ratings
}

module.exports = {
    UploadFile,
    DeleteFile,
    Host,
    UniqueCode,
    SendEmail,
    RatingCalculator
}