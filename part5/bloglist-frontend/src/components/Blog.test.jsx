import {render, screen} from '@testing-library/react'
import Blog from './Blog'
import userEvent from '@testing-library/user-event'

test('renders title and author but not url or likes by default', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'https://testing.com',
        likes: 10,
        user: {
            name: 'SuperUser',
            username: 'root'
        }
    }

    const user = {
        name: 'SuperUser',
        username: 'root'
    }

    render(<Blog blog={blog} user={user}/>)

    const titleElement = screen.getByText(blog.title, {exact: false})
    const authorElement = screen.getByText(blog.author, {exact: false})

    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()

    const urlElement = screen.queryByText(blog.url)
    const likesElement = screen.queryByText('likes', {exact: false})

    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
})

test('shows url and likes when the view button is clicked', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Test Author',
        url: 'https://testing.com',
        likes: 10,
        user: {
            name: 'SuperUser',
            username: 'root'
        }
    }

    const mockUser = {
        name: 'SuperUser',
        username: 'root'
    }

    render(<Blog blog={blog} user={mockUser}/>)

    const user = userEvent.setup()

    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText(blog.url)
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText('likes', {exact: false})
    expect(likesElement).toBeDefined()
})

test('if the like button is clicked twice, the event handler is called twice', async () => {
    const blog = {
        title: 'Testing Likes',
        author: 'Test Author',
        url: 'https://test.com',
        likes: 10,
        user: {
            name: 'SuperUser',
            username: 'root'
        }
    }

    const mockUser = {
        name: 'SuperUser',
        username: 'root'
    }

    const mockHandler = vi.fn()

    render(
        <Blog
            blog={blog}
            user={mockUser}
            addLikes={mockHandler}
        />
    )

    const userSession = userEvent.setup()

    const viewButton = screen.getByText('view')
    await userSession.click(viewButton)

    const likeButton = screen.getByRole('button', { name: 'like' })

    await userSession.click(likeButton)
    await userSession.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
})