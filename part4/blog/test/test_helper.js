const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Test 1',
        author: 'test author 1',
        url: 'test url 1',
        likes: 10
    },
    {
        title: 'Test 2',
        author: 'test author 2',
        url: 'test url 2',
        likes: 1
    },
    {
        title: 'Test 3',
        author: 'test author 3',
        url: 'test url 3',
        likes: 50
    }
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    usersInDb
}