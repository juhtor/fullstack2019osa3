const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const middleware = require('./utils/middleware')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (req, res) => {
    Person
        .find({})
        .then(result => {
            const count = result.length
            msg = '<p>Puhelinluettelossa ' + count + ' henkilön tiedot</p>'
                + '<p>' + Date() + '</p>'
            res.send(msg)
        })
        .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Person.find({})
        .then(persons => {
            response.json(persons.map(person => person.toJSON()))
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(204).end()
            }

        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    console.log('name', body.name)
    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number missing' })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            console.log('saved', savedPerson)
            response.json(savedPerson.toJSON())
        })
        .catch(error => next(error))

    // Person.find({ name: body.name })
    //     .then(foundPerson => {
    //         console.log(foundPerson, 'found person to check if name already exists')
    //         if (foundPerson.length > 0) {
    //             return response.status(400).json({ error: 'name already in the list' })
    //         }

    //         const person = new Person({
    //             name: body.name,
    //             number: body.number
    //         })

    //         person.save()
    //             .then(savedPerson => {
    //                 console.log('saved', savedPerson)
    //                 response.json(savedPerson.toJSON())
    //             })

    //     })

})
app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const person = {
        name: body.name,
        number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true })
        .then(updatedPerson => {
            response.json(updatedPerson.toJSON())
        })
        .catch(error => { next(error) })
})
app.use(middleware.unknownEndpoint)

app.use(middleware.errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



