const jwt = require('jsonwebtoken');
const logger = require('./logger');
const User = require('../models/users');

const userExtractor = async (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);

        const decodedToken = jwt.verify(request.token, process.env.SECRET);
        request.user = await User.findById(decodedToken.id);
    }

    next();
};

const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        request.token = authorization.substring(7);
    }

    next();
};

const errorHandler = (error, request, response, next) => {
    logger.error(`${error.name} - ${error.message}`);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === 'MongoServerError' && error.code === 11000) {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({
            error: 'invalid token'
        });
    }
    if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        });
    }

    return next(error);
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
