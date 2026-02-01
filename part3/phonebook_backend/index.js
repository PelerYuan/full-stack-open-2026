const express = require('express')
const morgan = require('morgan')
const {request} = require("express");
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())

morgan.token('body', (request) => {
    return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let phonebook = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const currentDate = new Date()
    const count = phonebook.length
    const html = `<p>Phone book has info for ${count}</p><p>${currentDate}</p>`
    response.send(html)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return String(Math.floor(Math.random() * 100000))
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name){
        return response.status(400).json({
            error: 'name missing'
        })
    }
    if (!body.number){
        return response.status(400).json({
            error: 'number missing'
        })
    }
    if (phonebook.find(p => p.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }
    phonebook = phonebook.concat(person)
    response.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})