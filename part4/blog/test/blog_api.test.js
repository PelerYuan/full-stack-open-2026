const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('../test/test_helper')
const app = require('../app.js')
const Blog = require('../models/blog')
const assert = require('node:assert')
const {response} = require("express");

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    const result = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(result.body.length, helper.initialBlogs.length)
})

test('check id property', async () => {
    const result = await api.get('/api/blogs')
    const firstBlog = result.body[0]

    assert.ok(firstBlog.id)
    assert.strictEqual(firstBlog._id, undefined)
})

test('add blog', async () => {
    const newBlog = {
        title: 'Add blog test',
        author: 'add test author',
        url: 'add test url',
        likes: 114514
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const result = await api.get('/api/blogs')

    assert.strictEqual(result.body.length, helper.initialBlogs.length + 1)
})

test('add blog without likes', async () => {
    const newBlog = {
        title: 'Add blog test',
        author: 'add test author',
        url: 'add test url',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)

    const result = await api.get('/api/blogs')
    assert.strictEqual(result.body[result.body.length -1].likes, 0)
})

test('add blog without url or title', async () => {
    let newBlog = {
        author: 'add test author',
        url: 'add test url',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

    newBlog = {
        title: 'Add blog test',
        author: 'add test author',
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})

test('delete blog', async () => {
    const result = await api.get('/api/blogs')
    const deleteId = result.body[0].id

    await api
        .delete(`/api/blogs/${deleteId}`)
        .expect(204)

    const deletedResult = await api.get('/api/blogs')
    assert.strictEqual(deletedResult.body.length, result.body.length - 1)
})


test('update blog', async () => {
    const result = await api.get('/api/blogs')
    const updateBlog = result.body[0]
    updateBlog.likes = 10721

    await api
        .put(`/api/blogs/${updateBlog.id}`)
        .send(updateBlog)
        .expect(200)

    const updatedResult = await api.get('/api/blogs')
    assert.strictEqual(updatedResult.body[0].likes, 10721)
})

after(async () => {
    await mongoose.connection.close()
})