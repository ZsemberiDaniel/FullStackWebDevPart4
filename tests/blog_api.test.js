const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blogs');
const User = require('../models/users');
const app = require('../app');
const { initialPosts, initialUsers } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(initialPosts);

    await User.deleteMany({});
    await User.insertMany(initialUsers);
});

describe('with some notes save initially', () => {
    test('/api/blogs GET notes are JSON', async () => {
        await api.get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/);
    });

    test('/api/blogs GET notes are of the correct length', async () => {
        const response = await api.get('/api/blogs');

        expect(response.body).toHaveLength(initialPosts.length);
    });

    test('/api/blogs GET notes have id property', async () => {
        const response = await api.get('/api/blogs');

        response.body.forEach((blog) => {
            expect(blog.id).toBeDefined();
        });
    });

    test('/api/blogs POST adds extra post and returns JSON', async () => {
        const userToken = await api.post('/api/login').send({ username: 'daniel', password: 'daniel' });

        const newBlog = {
            title: 'My life',
            author: 'Daniel Zsemberi',
            url: 'https://daniel.zsemberi.dev',
            likes: 100
        };
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${userToken.body.token}`)
            .send(newBlog).expect(201).expect('Content-Type', /application\/json/);
    });

    test('/api/blogs POST returns 401 on bad auth token', async () => {
        const userToken = await api.post('/api/login').send({ username: 'daniel', password: 'daniel' });

        const newBlog = {
            title: 'My life',
            author: 'Daniel Zsemberi',
            url: 'https://daniel.zsemberi.dev',
            likes: 100
        };
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${userToken.body.token}12`)
            .send(newBlog).expect(401);
    });

    test('/api/blogs POST adds extra post and returns added', async () => {
        const userToken = await api.post('/api/login').send({ username: 'daniel', password: 'daniel' });

        const newBlog = {
            title: 'My life',
            author: 'Daniel Zsemberi',
            url: 'https://daniel.zsemberi.dev',
            likes: 100
        };
        const returned = await api.post('/api/blogs')
            .set('Authorization', `bearer ${userToken.body.token}`).send(newBlog);

        expect(returned.body).toMatchObject(newBlog);
    });

    test('/api/blogs POST adds extra post and GET reflects change', async () => {
        const userToken = await api.post('/api/login').send({ username: 'daniel', password: 'daniel' });

        const newBlog = {
            title: 'My life',
            author: 'Daniel Zsemberi',
            url: 'https://daniel.zsemberi.dev',
            likes: 100
        };
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${userToken.body.token}`).send(newBlog);
        const allBlogs = await api.get('/api/blogs');

        expect(allBlogs.body.length).toBe(initialPosts.length + 1);
    });

    test('/api/blogs POST without like adds with 0 likes', async () => {
        const userToken = await api.post('/api/login').send({ username: 'daniel', password: 'daniel' });

        const newBlog = {
            title: 'My life',
            author: 'Daniel Zsemberi',
            url: 'https://daniel.zsemberi.dev'
        };
        const addedBlog = await api.post('/api/blogs')
            .set('Authorization', `bearer ${userToken.body.token}`).send(newBlog);

        expect(addedBlog.body).toHaveProperty('likes', 0);
    });

    test('/api/blogs POST without title/url returns 400', async () => {
        const userToken = await api.post('/api/login').send({ username: 'daniel', password: 'daniel' });

        const newBlog = {
            author: 'Daniel Zsemberi',
            likes: 100
        };
        await api.post('/api/blogs')
            .set('Authorization', `bearer ${userToken.body.token}`).send(newBlog).expect(400);
    }, 100000);

    // test('/api/blogs DELETE with right ID', async () => {
    //     await api.delete(`/api/blogs/${initialPosts[0]._id}`).expect(204);
    // });

    // test('/api/blogs DELETE with wrong ID', async () => {
    //     await api.delete('/api/blogs/1').expect(400);
    // });

    // test('/api/blogs PUT with right ID recieves JSON', async () => {
    //     const newBlog = {
    //         ...initialPosts[0],
    //         likes: 100
    //     };
    //     delete newBlog._id;
    //     delete newBlog.__v;

    //     await api.put(`/api/blogs/${initialPosts[0]._id}`).send(newBlog).expect(200).expect('Content-Type', /application\/json/);
    // });

    // test('/api/blogs PUT with right ID returns updated', async () => {
    //     const newBlog = {
    //         ...initialPosts[0],
    //         likes: 100
    //     };
    //     delete newBlog._id;
    //     delete newBlog.__v;

    //     const updatedBlog = await api.put(`/api/blogs/${initialPosts[0]._id}`).send(newBlog);
    //     expect(updatedBlog.body).toMatchObject(newBlog);
    // });

    // test('/api/blogs PUT with wrong ID', async () => {
    //     const newBlog = {
    //         ...initialPosts[0],
    //         likes: 100
    //     };
    //     delete newBlog._id;
    //     delete newBlog.__v;

    //     await api.put('/api/blogs/1').send(newBlog).expect(400);
    // });
});

afterAll(() => {
    mongoose.connection.close();
});
