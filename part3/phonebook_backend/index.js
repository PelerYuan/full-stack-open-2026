require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const {request, response} = require("express");
const cors = require('cors')
const Phonebook = require('./module/phonebook')

const app = express()

app.use(express.json())
app.use(express.static('dist'))
app.use(cors())

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(data => {
        response.json(data)
    })
})

app.get('/info', (request, response) => {
    Phonebook.find({}).then(data => {
        const currentDate = new Date()
        const count = data.length
        const html = `<p>Phone book has info for ${count}</p><p>${currentDate}</p>`
        response.send(html)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findById(id)
        .then(data => {
            if (data) {
                response.json(data)
            } else {
                response.status(404).end()
            }
        }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Phonebook.findByIdAndDelete(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    Phonebook.findOne({name: body.name}).then(data => {
        if (data) {
            return response.status(400).json({
                error: 'name must be unique'
            })
        }
    })

    const person = new Phonebook({
        name: body.name,
        number: body.number
    })

    person.save().then(data => {
        response.json(data)
    })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body

    Phonebook.findById(request.params.id)
        .then(person => {
            if (!person) {
                return response.status(404).end()
            }

            person.name = name
            person.number = number

            return person.save().then(updatedData => {
                response.json(updatedData)
            })
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})