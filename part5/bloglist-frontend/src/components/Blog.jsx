import { useState } from 'react'

const Blog = ({ blog, addLikes, removeBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10, paddingLeft: 2, border: 'solid', borderWidth: 1, marginBottom: 5
    }

    return (<div style={blogStyle} className="blog">
        <div>
            {blog.title} {blog.author}
            <button onClick={() => setVisible(!visible)}>
                {visible ? 'hide' : 'view'}
            </button>
        </div>

        {visible && (<div className="blog-details">
            <div>{blog.url}</div>
            <div>
                likes {blog.likes}
                <button onClick={() => addLikes(blog)}>like</button>
            </div>
            <div>{blog.user.name}</div>

            {user.name === blog.user.name && (<button onClick={() => removeBlog(blog)}>remove</button>)}
        </div>)}
    </div>)
}

export default Blog