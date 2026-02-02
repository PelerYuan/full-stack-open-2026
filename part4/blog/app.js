const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')

const app = express()

mongoose.connect(config.MONGODB_URL)

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app
