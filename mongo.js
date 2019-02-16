const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password, (name and number) as arguments')
    process.exit(1)
}

const password = process.argv[2]
const url =
    `mongodb+srv://fullstack:${password}@cluster0-bsymi.mongodb.net/test?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    console.log('puhelinluettelo')
    Person.find({})
        .then(foundPersons => {
            foundPersons.forEach(person => {
                console.log(person.name + ' ' + person.number)
            })
            mongoose.connection.close();
        })
} else {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person({
        name: name,
        number: number
    })
    person.save().then(response => {
        console.log('lisättiin ' + name
            + ' numero ' + number + ' luetteloon');
        mongoose.connection.close();
    })
}
