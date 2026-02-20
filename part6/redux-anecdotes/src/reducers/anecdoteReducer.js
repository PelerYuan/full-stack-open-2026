import {createSlice} from '@reduxjs/toolkit'

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
        createAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action) {
            return action.payload
        }
    }
})

export const {voteFor, createAnecdote, setAnecdotes} = anecdoteSlice.actions


export default anecdoteSlice.reducer