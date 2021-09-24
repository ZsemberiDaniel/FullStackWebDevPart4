const _ = require('lodash');

const dummy = (posts) => 1;

const totalLikes = (posts) => {
    if (posts.length === 0) return 0;

    return posts.map(post => post.likes).reduce((a, b) => a + b);
};

const favoriteBlog = (posts) => {
    if (posts.length === 0) return null;

    let favoriteId = 0;
    for (let i = 1; i < posts.length; i++)
    {
        if (posts[i].likes > posts[favoriteId].likes)
        {
            favoriteId = i;
        }
    }

    return {
        title: posts[favoriteId].title,
        author: posts[favoriteId].author,
        likes: posts[favoriteId].likes
    };
};

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null;

    const stillObj = _.chain(blogs).groupBy('author').mapValues(val => val.length).value();
    return _.maxBy(Object.entries(stillObj).map(([k, v]) => ({author: k, blogs: v})), 'blogs');
};

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null;

    const stillObj = _.chain(blogs).groupBy('author').mapValues(val => _(val).sumBy('likes')).value();
    return _.maxBy(Object.entries(stillObj).map(([k, v]) => ({author: k, likes: v})), 'likes');
};

module.exports = {
    dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
};
