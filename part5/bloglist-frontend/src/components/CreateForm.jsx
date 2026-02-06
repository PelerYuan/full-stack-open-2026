import { useState } from 'react'
import Togglable from './Togglable.jsx'

const CreateForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleCreate = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreate}>
        <div>
          <label>title:</label>
          <input type={'text'} value={title} name={'title'}
            onChange={({ target }) => setTitle(target.value)}/>
        </div>
        <div>
          <label>author:</label>
          <input type={'text'} value={author} name={'author'}
            onChange={({ target }) => setAuthor(target.value)}/>
        </div>
        <div>
          <label>url:</label>
          <input type={'url'} value={url} name={'url'} onChange={({ target }) => setUrl(target.value)}/>
        </div>
        <button>create</button>
      </form>
    </>
  )
}

export default CreateForm