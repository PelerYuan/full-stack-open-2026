import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login.js'
import Togglable from './components/Togglable.jsx'
import CreateForm from './components/CreateForm.jsx'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser) {
      const user = JSON.parse(loggedUser)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setMessage({
        message: 'wrong username or password',
        error: true
      })
      setTimeout(() => setMessage({ message: '', error: false }), 5000)
    }
  }

  const LoginForm = () => {
    return (
      <>
        <h2>log in to application</h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>username</label>
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <label>password</label>
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type={'submit'}>login</button>
        </form>
      </>
    )
  }

  const addLikes = async (blogObject) => {
    try {
      const updatedBlog = {
        ...blogObject,
        likes: blogObject.likes + 1,
      }
      const returnedBlog = await blogService.update(updatedBlog)
      setBlogs(blogs.map(blog => blog.id !== blogObject.id ? blog : returnedBlog).sort((a, b) => b.likes - a.likes))
    } catch (exception) {
      console.log('Failed to update likes', exception)
    }
  }

  const removeBlog = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        console.error('Error deleting blog', exception)
      }
    }
  }

  console.log(blogs)
  const BlogList = () => {
    return (
      <>
        <h2>blogs</h2>
        <p>{user.name} logged in <button onClick={() => {
          setUser(null)
          window.localStorage.removeItem('loggedUser')
        }}>logout</button></p>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} addLikes={addLikes} removeBlog={removeBlog} user={user}/>
        )}
      </>
    )
  }

  const [message, setMessage] = useState({ message: '', error: false })
  const messageBox = () => {
    if (message.message) {
      return (
        <>
          {message.error && <div className={'error'}>{message.message}</div>}
          {!message.error && <div className={'message'}>{message.message}</div>}
        </>
      )
    }
  }

  const createFormRef = useRef()
  const createBlog = async (blogObject) => {
    try {
      // 1. 调用 Service 发送请求
      const returnedBlog = await blogService.create(blogObject)

      // 2. 更新列表和消息
      setBlogs(blogs.concat(returnedBlog))
      setMessage({ message: `a new blog ${blogObject.title} added`, error: false })
      setTimeout(() => setMessage({ message: '', error: false }), 5000)

      // 3. 成功后关闭 Togglable 表单 (通过 ref)
      createFormRef.current.toggleVisibility()
    } catch {
      setMessage({ message: 'Error creating blog', error: true })
      setTimeout(() => setMessage({ message: '', error: false }), 5000)
    }
  }

  return (
    <div>
      {messageBox()}
      {!user && LoginForm()}
      {user && BlogList()}
      <Togglable buttonLabel={'create new blog'} ref={createFormRef}>
        {user && <CreateForm createBlog={createBlog}/>}
      </Togglable>
    </div>
  )
}

export default App