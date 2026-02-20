import AnecdoteForm from "./components/AnecdoteForm.jsx";
import AnecdoteList from "./components/AnecdoteList.jsx";
import Notification from "./components/Notification.jsx";
import anecdotesService from "./service/anecdotes.js";
import {useDispatch} from "react-redux";
import {use, useEffect} from "react";
import {initializeAnecdotes, setAnecdotes} from "./reducers/anecdoteReducer.js";

const App = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAnecdotes())
    }, [dispatch]);

    return (
        <div>
            <h2>Anecdotes</h2>
            <Notification/>
            <AnecdoteList/>
            <AnecdoteForm/>
        </div>
    )
}

export default App
