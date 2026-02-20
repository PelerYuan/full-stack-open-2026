import {useSelector, useDispatch} from "react-redux";
import {voteAnecdote, voteFor} from "../reducers/anecdoteReducer.js";
import {clearNotification, setNotification} from "../reducers/notificationReducer.js";

const AnecdoteList = () => {
    const anecdotes = useSelector(state => state.anecdotes)
    const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes)
    const dispatch = useDispatch()

    const vote = (anecdote) => {
        dispatch(voteAnecdote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`))
    }

    return (
        <>
            {
                sortedAnecdotes.map(anecdote => (
                    <div key={anecdote.id}>
                        <div>{anecdote.content}</div>
                        <div>
                            has {anecdote.votes}
                            <button onClick={() => vote(anecdote)}>vote</button>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default AnecdoteList
