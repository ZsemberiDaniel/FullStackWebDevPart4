const blogsRouter = require('express').Router();
const Blog = require('../models/blogs');

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
});

blogsRouter.post('/', async (request, response, next) => {
    try {
        if (!request.user) return response.status(401).json({ error: 'invalid or missing token' });
        const user = request.user;

        // assigning user to blog
        request.body.user = user._id;

        const blog = await new Blog(request.body).save();

        // adding blog to user
        user.blogs = user.blogs.concat(blog._id);
        await user.save();

        response.status(201).json(blog);
    } catch (exception) {
        response.status(400);
        next(exception);
    }
});

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        if (!blog) response.status(400).json({ error: 'blog does not exist!' });

        if (!request.user) return response.status(401).json({ error: 'invalid or missing token' });

        if (request.user._id.toString() !== blog.user.toString()) {
            return response.status(401).json({ error: 'cannot delete blog of other user' });
        }

        await Blog.findByIdAndDelete(request.params.id);
        response.status(204).end();
    } catch (exception) {
        response.status(400);
        next(exception);
    }
});

blogsRouter.put('/:id', async (request, response, next) => {
    const newBlog = {
        title: request.body.title,
        author: request.body.author,
        url: request.body.url,
        likes: request.body.likes
    };

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true }).populate('user', { username: 1, name: 1 });
        response.status(200).json(updatedBlog);
    } catch (exception) {
        response.status(400);
        next(exception);
    }
});

blogsRouter.get('/:id', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 });
        response.status(200).json(blog);
    } catch (exception) {
        response.status(400);
        next(exception);
    }
});

blogsRouter.post('/:id/comments', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        blog.comments.push(`${new Date()} ${request.body.newComment}`);

        await blog.save();
        response.status(200).json(blog);
    } catch (exception) {
        response.status(400);
        next(exception);
    }
});

blogsRouter.get('/:id/comments', async (request, response, next) => {
    try {
        const blog = await Blog.findById(request.params.id);
        response.status(200).json(blog.comments);
    } catch (exception) {
        response.status(400);
        next(exception);
    }
});

module.exports = blogsRouter;
