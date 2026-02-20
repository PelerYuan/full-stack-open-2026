import {createSlice} from '@reduxjs/toolkit'
import anecdotesService from "../service/anecdotes.js";
import anecdotes from "../service/anecdotes.js";

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        voteFor(state, action) {
            const id = action.payload
            const anecdoteToChange = state.find(an => an.id === id)
            if (anecdoteToChange) {
                anecdoteToChange.votes += 1
            }
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const {voteFor, appendAnecdote, setAnecdotes} = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const ane = await anecdotesService.getAll()
        dispatch(setAnecdotes(ane))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAne = await anecdotesService.createNew(content)
        dispatch(appendAnecdote(newAne))
    }
}

export const voteAnecdote = (contnet) => {
    return async dispatch => {
        const changedAne = {
            ...contnet,
            votes: contnet.votes + 1
        }
        const updatedAne = await anecdotesService.update(contnet.id, changedAne)
        dispatch(voteFor(updatedAne.id))
    }
}

export default anecdoteSlice.reducer