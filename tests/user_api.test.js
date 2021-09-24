const mongoose = require('mongoose');
const supertest = require('supertest');
const User = require('../models/users');
const app = require('../app');
const { initialUsers } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(initialUsers);
});

describe('with some users initially', () => {
    test('/api/users username at least 3 characters', async () => {
        api.post('/api/users').send({ username: 'a', password: 'aasdasdasd' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });

    test('/api/users password at least 3 characters', async () => {
        api.post('/api/users').send({ username: 'aasdasdasd', password: 'a' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });

    test('/api/users username unique', async () => {
        api.post('/api/users').send({ username: 'aaa', password: 'aaa' })
            .expect(200)
            .expect('Content-Type', /application\/json/);

        api.post('/api/users').send({ username: 'aaa', password: 'aaa' })
            .expect(400)
            .expect('Content-Type', /application\/json/);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
