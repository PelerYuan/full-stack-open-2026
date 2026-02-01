import {useState} from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Bold = ({text}) => <h2>{text}</h2>

const StatisticLine = ({text, value}) => <tr>
    <td>{text}</td>
    <td>{value}</td>
</tr>

const Statistics = (props) => {
    const good = props.good
    const bad = props.bad
    const neutral = props.neutral
    const all = good + neutral + bad

    return (
        <div>
            <Bold text={"statistics"}/>
            <table>
                <tbody>
                <StatisticLine text={"good"} value={good}/>
                <StatisticLine text={"neutral"} value={neutral}/>
                <StatisticLine text={"bad"} value={bad}/>
                <StatisticLine text={"all"} value={all}/>
                <StatisticLine text={"average"} value={(good - bad) / all}/>
                <StatisticLine text={"positive"} value={good / all * 100 + " %"}/>
                </tbody>
            </table>
        </div>
    )
}

const App = () => {
    // save clicks of each button to its own state
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const goodIncrease = () => setGood(good + 1)
    const neutralIncrease = () => setNeutral(neutral + 1)
    const badIncrease = () => setBad(bad + 1)


    return (
        <div>
            <Bold text={"give feedback"}/>
            <Button onClick={goodIncrease} text={"good"}/>
            <Button onClick={neutralIncrease} text={"neutral"}/>
            <Button onClick={badIncrease} text={"bad"}/>
            <Statistics good={good} neutral={neutral} bad={bad}/>
        </div>
    )
}

export default App