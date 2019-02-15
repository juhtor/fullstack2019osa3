const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.static('build'))
app.use(bodyParser.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
const generateId = () => {
    // const maxId =
    //     persons.length > 0
    //         ? Math.max(...persons.map(n => n.id))
    //         : 0
    // return maxId + 1
    return Math.floor(Math.random() * 10000) + 1
}

persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Martti Tienari",
        "number": "040-123456",
        "id": 2
    },
    {
        "name": "Arto Järvinen",
        "number": "040-123456",
        "id": 3
    },
    {
        "name": "Lea Kutvonen",
        "number": "040-123456",
        "id": 4
    }
]

// app.get('/', (req, res) => {
//     res.send('<h1>Hello World!</h1>')
// })
app.get('/info', (req, res) => {
    msg = '<p>Puhelinluettelossa ' + persons.length + ' henkilön tiedot</p>'
        + '<p>' + Date() + '</p>'
    res.send(msg)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
        return response.status(400).json({ error: 'name or number missing' })
    }
    const found = persons.filter(person => person.name === body.name)
    if (found.length > 0) {
        return response.status(400).json({ error: 'name already in the list' })
    }
    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/build/index.html'));
// });


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)