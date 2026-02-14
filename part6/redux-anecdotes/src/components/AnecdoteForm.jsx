import {useDispatch} from "react-redux";
import {createAnecdote} from "../reducers/anecdoteReducer.js";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdotes = event => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
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