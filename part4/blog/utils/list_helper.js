const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const favoriteBlog = blogs.reduce((max, blog) => {
        return max.likes > blog.likes ? max : blog
    }, blogs[0])

    return {
        title: favoriteBlog.title,
        author : favoriteBlog.author,
        likes: favoriteBlog.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0){
        return null
    }

    const authorCounts = _.countBy(blogs, 'author')
    const topAuthor = _.maxBy(_.keys(authorCounts), author => authorCounts[author]
    )

    return {
        author: topAuthor,
        blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) {
        return null
    }

    const groupBlogs = _.groupBy(blogs, 'author')
    const authorLikes = _.map(groupBlogs, (authorBlogs, authorName) => {
        return {
            author: authorName,
            likes: _.sumBy(authorBlogs, 'likes')
        }
    })

    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}