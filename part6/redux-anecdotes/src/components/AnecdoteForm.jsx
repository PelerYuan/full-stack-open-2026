import {useDispatch} from "react-redux";
import {createAnecdote} from "../reducers/anecdoteReducer.js";
import {clearNotification, setNotification} from "../reducers/notificationReducer.js";
import anecdotesService from "../service/anecdotes.js";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdotes = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        const newAnecdote = await anecdotesService.createNew(content)
        dispatch(createAnecdote(newAnecdote))
        dispatch(setNotification(`you created '${newAnecdote.content}'`))
        setTimeout(() => {
            dispatch(clearNotification())
        }, 5000)
    }

    return (
        <>
            <h2>create new</h2>
            <form onSubmit={addAnecdotes}>
                <div>
                    <input name={"anecdote"}/>
                </div>
                <button>create</button>
            </form>
        </>
    )
}

export default AnecdoteForm