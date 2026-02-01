import {useState, useEffect} from 'react'
import axios from "axios";

const NationList = ({nations, nationData}) => {
    if (!nations) return null;

    if (nations.length > 10) {
        return <div>Too many matches, specify another filter</div>
    } else {
        if (nations.length !== 1) {
            return (
                <div>
                    {nations.map(nation => <div key={nation}>{nation}</div>)}
                </div>
            )
        } else {
            const response = nationData.filter(n => n.name.common.toLowerCase() === nations[0].toLowerCase())[0]
            console.log(response)
            return (
                <>
                    <h1>{response.name.common}</h1>
                    <p>Capital {response.capital[0]}</p>
                    <p>Area {response.area}</p>
                    <h1>Languages</h1>
                    <ul>
                        {Object.values(response.languages).map(language => (
                            <li key={language}>{language}</li>
                        ))}
                    </ul>
                    <img src={response.flags.png} width="150" alt={response.name.common}/>
                </>
            )
        }
    }
}

const App = () => {
    const [name, setName] = useState('')
    const [nationNames, setNationNames] = useState([])
    const [nationData, setNationData] = useState({})

    useEffect(() => {
        axios.get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
            .then(response => {
                setNationData(response.data)
                const data = response.data.map(n => n.name.common)
                setNationNames(data)
                console.log(data)
            })
    }, []);

    const handleChange = (event) => {
        setName(event.target.value)
    }

    const nationsToShow = name === ''
        ? null
        : nationNames.filter(n => n.toLowerCase().includes(name.toLowerCase()))

    return (
        <div>
            <form onSubmit={event => event.preventDefault()}>
                find countries<input value={name} onChange={handleChange}/>
            </form>
            <NationList nations={nationsToShow} nationData={nationData}/>
        </div>
    )
}

export default App
