const assert = require('node:assert')
const bcrypt = require('bcrypt')
const {test, after, beforeEach, describe} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('User management system', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('secret', 10)
        const user = new User({username: 'root', passwordHash})
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'kael',
            name: 'Kael The Invoker',
            password: 'validpassword',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()

        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert.ok(usernames.includes(newUser.username))
    })

    test('users can be viewed', async () => {
        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.length, 1)
        assert.strictEqual(response.body[0].username, 'root')
    })

    test('creation fails with HTTP 400 if password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'validUser',
            name: 'User Name',
            password: 'no',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert.ok(result.body.error.includes('password is required'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with HTTP 400 if username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 're',
            password: 'validpassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            password: 'validpassword',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert.ok(result.body.error.includes('expected `username` to be unique'))

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

describe('Blog API with User association', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        const user = new User({
            username: 'root',
            name: 'Super User',
            passwordHash: 'sekret'
        })
        await user.save()

        const blog = new Blog({
            title: 'Canonical String Reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12,
            user: user._id
        })
        await blog.save()
    })

    test('fetching all blogs returns populated user info', async () => {
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const blogs = response.body

        const firstBlog = blogs[0]

        console.log('User field content:', firstBlog.user)

        assert.ok(firstBlog.user.username)
        assert.ok(firstBlog.user.name)
        assert.strictEqual(firstBlog.user.username, 'root')
    })
})


describe('Blog creation checks', () => {
    let userInDb

    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})

        userInDb = new User({
            username: 'root',
            name: 'Super User',
            passwordHash: 'hashed_secret'
        })
        await userInDb.save()
    })

    test('POST /api/blogs automatically adds user field when request does not provide one', async () => {
        const newBlog = {
            title: 'Auto Assign Test',
            author: 'Tester',
            url: 'http://test.com/auto',
            likes: 0
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.user, 'Response should contain a user field automatically assigned by backend')

        assert.notStrictEqual(response.body.user, null)
        assert.notStrictEqual(response.body.user, undefined)
    })
})

after(async () => {
    await mongoose.connection.close()
})