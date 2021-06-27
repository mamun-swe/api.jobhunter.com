const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const mongoose = require('mongoose')
const bodyParser = require("body-parser")
const nocache = require('nocache')
const compression = require('compression')
const helmet = require('helmet')
require('dotenv').config()
const Route = require('./API/Routes/Index')

const app = express()
app.use(compression())
app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(nocache())

// API URL's
app.use("/api/v1", Route)

app.get('/', (req, res) => {
    res.send("Hello I am node.js application")
})

app.use((req, res, next) => {
    let error = new Error('404 page Not Found')
    error.status = 404
    next(error)
})

app.use((error, req, res, next) => {
    if (error.status == 404) {
        return res.status(404).json({
            message: error.message
        })
    }
    if (error.status == 400) {
        return res.status(400).json({
            message: "Bad request"
        })
    }
    if (error.status == 401) {
        return res.status(401).json({
            message: "You have no permission"
        })
    }
    return res.status(500).json({
        message: "Internal Server Error"
    })
})


// DB Connection here
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    autoIndex: false,
    useFindAndModify: false
})
    .then(() => console.log("Database connected"))
    .catch(error => {
        if (error) console.log('Failed to connect DB')
    })

// App Port
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`App running on ${port} port`)
})
