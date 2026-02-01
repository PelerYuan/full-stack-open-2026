import {useState, useEffect, use} from 'react'
import phoneService from './services/phone.js'

const Filter = ({newSearch, setNewSearch}) => {
    const handleSearchChange = (event) => {
        setNewSearch(event.target.value)
    }

    return (
        <form>
            filter shown with<input value={newSearch} onChange={handleSearchChange}/>
        </form>
    )
}

const Notification = ({notification}) => {
    if (notification.message === null)
        return null

    if (notification.error) {
        return (
            <div className={'error'}>
                {notification.message}
            </div>
        )
    } else {
        return (
            <div className={'notification'}>
                {notification.message}
            </div>
        )
    }
}

const PersonForm = ({newName, setNewName, newNumber, setNewNumber, persons, setPersons, setNotification}) => {
    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const addName = (event) => {
        event.preventDefault()
        if (persons.some(person => person.name === newName)) {
            if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
                const person = persons.find(p => p.name === newName)
                const changedPerson = {...person, number: newNumber}
                phoneService.update(person.id, changedPerson)
                    .then(response => {
                        setPersons(persons.map(p => p.name === newName ? response.data : p))
                    })
                    .catch(error => {
                        setNotification({message: `${person.name}'s information has already been deleted`, error: true})
                        setTimeout(() => {
                            setNotification({message: null, error: false})
                        }, 3000)
                        setPersons(persons.filter(p => p.name !== person.name))
                    })
                setNotification({message: `modify ${person.name}'s number`, error: false})
                setTimeout(() => {
                    setNotification({message: null, error: false})
                }, 3000)
            }
        } else {
            const person = {
                name: newName,
                number: newNumber,
                id: newName
            }
            phoneService
                .create(person)
                .then(response => {
                    setPersons(persons.concat(response.data))
                    setNewName('')
                    setNewNumber('')
                })
            setNotification({message: `add ${person.name}'s number`, error: false})
            setTimeout(() => {
                setNotification({message: null, error: false})
            }, 3000)
        }
    }

    return (
        <form onSubmit={addName}>
            <div>
                name: <input value={newName} onChange={handleNameChange}/>
            </div>
            <div>
                number: <input value={newNumber} onChange={handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

const Persons = ({personToShow, persons, setPersons}) => {
    const delete_ = (person) => {
        if (window.confirm(`Delete ${person.name} ?`))
            phoneService.delete_(person.id)
                .then(response => {
                    setPersons(persons.filter(p => p.id !== person.id))
                })
    }
    return (
        <div>
            {personToShow.map(person =>
                <div key={person.name}>
                    {person.name} {person.number}
                    <button onClick={() => delete_(person)}>delete</button>
                </div>)}
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [newSearch, setNewSearch] = useState('')
    const [notification, setNotification] = useState({message: null, error: false})

    useEffect(() => {
        phoneService
            .getAll()
            .then(response => {
                setPersons(response.data)
            })
    }, []);

    const personToShow = newSearch === ''
        ? persons
        : persons.filter(person => person.name.toLocaleLowerCase().includes(newSearch.toLowerCase()))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification notification={notification}/>
            <Filter newSearch={newSearch} setNewSearch={setNewSearch}/>
            <h3>add a new</h3>
            <PersonForm persons={persons} setPersons={setPersons} newName={newName} setNewName={setNewName}
                        newNumber={newNumber} setNewNumber={setNewNumber} setNotification={setNotification}/>
            <h3>Numbers</h3>
            <Persons personToShow={personToShow} persons={persons} setPersons={setPersons}/>
        </div>
    )
}

export default App