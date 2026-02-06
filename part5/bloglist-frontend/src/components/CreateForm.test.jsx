import { render, screen } from '@testing-library/react'
import CreateForm from './CreateForm'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'

test('<CreateForm /> updates parent state and calls onSubmit', async () => {
    const createBlog = vi.fn()
    const user = userEvent.setup()

    render(<CreateForm createBlog={createBlog} />)

    const inputs = screen.getAllByRole('textbox')
    const titleInput = inputs[0]
    const authorInput = inputs[1]
    const urlInput = inputs[2]

    const sendButton = screen.getByText('create')

    await user.type(titleInput, 'testing')
    await user.type(authorInput, 'Tester')
    await user.type(urlInput, 'https://test.com')

    await user.click(sendButton)

    expect(createBlog).toHaveBeenCalledTimes(1)

    expect(createBlog.mock.calls[0][0].title).toBe('testing')
    expect(createBlog.mock.calls[0][0].author).toBe('Tester')
    expect(createBlog.mock.calls[0][0].url).toBe('https://test.com')
})