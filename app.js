const express = require('express');
require('express-async-errors');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const logger = require('./utils/logger');
const middlewares = require('./utils/middleware');

const app = express();

mongoose.connect(config.MONGODB_URI)
    .then((result) => {
        logger.info(`Connected to MongoDB ${result}`);
    })
    .catch((error) => {
        logger.error(`Could not connect to MongoDB ${error}`);
    });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use('/api/blogs', middlewares.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middlewares.errorHandler);

module.exports = app;
