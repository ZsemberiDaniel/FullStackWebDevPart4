const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/users');

userRouter.post('/', async (request, response, next) => {
    if (!request.body.password) {
        next({
            name: 'ValidationError',
            message: 'No password given!'
        });
        return;
    }
    if (request.body.password.length < 3) {
        next({
            name: 'ValidationError',
            message: 'Password needs to be at least 3 characters long!'
        });
        return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(request.body.password, saltRounds);

    const user = new User({
        username: request.body.username,
        name: request.body.name,
        passwordHash
    });

    const savedUser = await user.save();

    response.json(savedUser);
});

userRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {
        title: 1, url: 1, author: 1, likes: 1
    });
    response.json(users);
});

module.exports = userRouter;
