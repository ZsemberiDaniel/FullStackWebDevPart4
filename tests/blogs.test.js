const listHelper = require('../utils/list_helper');
const Blog = require('../models/blogs');

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe('totalLikes', () => {
    test(' of 0 posts', () => {
        expect(listHelper.totalLikes([])).toBe(0);
    });

    test(' of 1 post', () => {
        const likeCount = randomIntFromInterval(10, 100);
        expect(listHelper.totalLikes([new Blog({
            _id: '5a422aa71b54a676234d17f8', __v: 0, title: "Post 1", author: "Author 1", url: "my-post", likes: likeCount
        })])).toBe(likeCount);
    });

    test(' of multiple posts', () => {
        const posts = [
            new Blog({_id: '5a422aa71b54a676234d17f8', __v: 0, title: "Post 1", author: "Author 1", url: "my-post", likes: 10}),
            new Blog({_id: '5a422aa71b54a676234d17f9', __v: 0, title: "Post 2", author: "Author 2", url: "my-post2", likes: 0}),
            new Blog({_id: '5a422aa71b54a676234d17f0', __v: 0, title: "Post 3", author: "Author 3", url: "my-post3", likes: 12}),
            new Blog({_id: '5a422aa71b54a676234d17f1', __v: 0, title: "Post 4", author: "Author 4", url: "my-post4", likes: 23}),
            new Blog({_id: '5a422aa71b54a676234d17f2', __v: 0, title: "Post 5", author: "Author 5", url: "my-post5", likes: 34}),
            new Blog({_id: '5a422aa71b54a676234d17f3', __v: 0, title: "Post 6", author: "Author 6", url: "my-post6", likes: 10})
        ];

        expect(listHelper.totalLikes(posts)).toBe(89);
    });
});

describe('favoriteBlog', () => {
    const blogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }  
    ];

    test(' of 0 blogs', () => {
        expect(listHelper.favoriteBlog([])).toBe(null);
    });

    test(' of 1 blog', () => {
        expect(listHelper.favoriteBlog([blogs[0]])).toEqual(
            {author: blogs[0].author, likes: blogs[0].likes, title: blogs[0].title}
        );
    });

    test(' of multiple different liked blogs', () => {
        expect(listHelper.favoriteBlog(blogs)).toEqual(
            {author: blogs[2].author, likes: blogs[2].likes, title: blogs[2].title}
        );
    });

    test(' of multiple same liked blogs', () => {
        expect(listHelper.favoriteBlog([    
            {
                _id: "5a422bc61b54a676234d17fc",
                title: "Type wars",
                author: "Robert C. Martin",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
                likes: 2,
                __v: 0
            },
            {
                _id: "5a422bc61b54a676234d17as",
                title: "Type wars 2",
                author: "Robert C. Martin 2",
                url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars2.html",
                likes: 2,
                __v: 0
            }
        ])).toHaveProperty("likes", 2);
    });
});

describe('mostBlogs', () => {
    const blogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }  
    ];

    test(' of 0 blogger', () => {
        expect(listHelper.mostBlogs([])).toBe(null);
    });

    test(' of 1 blogger', () => {
        expect(listHelper.mostBlogs([blogs[3]])).toEqual({author: 'Robert C. Martin', blogs: 1});
    });

    test(' of all bloggers', () => {
        expect(listHelper.mostBlogs(blogs)).toEqual({author: 'Robert C. Martin', blogs: 3});
    });

    test(' of more than 1 max', () => {
        expect(listHelper.mostBlogs([blogs[0], blogs[0], blogs[1], blogs[1]])).toHaveProperty('blogs', 2);
    });
});

describe('mostLikes', () => {
    const blogs = [
        {
            _id: "5a422a851b54a676234d17f7",
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 7,
            __v: 0
        },
        {
            _id: "5a422aa71b54a676234d17f8",
            title: "Go To Statement Considered Harmful",
            author: "Edsger W. Dijkstra",
            url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
            likes: 5,
            __v: 0
        },
        {
            _id: "5a422b3a1b54a676234d17f9",
            title: "Canonical string reduction",
            author: "Edsger W. Dijkstra",
            url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes: 12,
            __v: 0
        },
        {
            _id: "5a422b891b54a676234d17fa",
            title: "First class tests",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
            likes: 10,
            __v: 0
        },
        {
            _id: "5a422ba71b54a676234d17fb",
            title: "TDD harms architecture",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
            likes: 0,
            __v: 0
        },
        {
            _id: "5a422bc61b54a676234d17fc",
            title: "Type wars",
            author: "Robert C. Martin",
            url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
            likes: 2,
            __v: 0
        }  
    ];

    test(' of 0 person', () => {
        expect(listHelper.mostLikes([])).toBe(null);
    });

    test(' of 1 person', () => {
        expect(listHelper.mostLikes([blogs[1]])).toEqual({author: 'Edsger W. Dijkstra', likes: 5});
    });

    test(' of all people', () => {
        expect(listHelper.mostLikes(blogs)).toEqual({author: 'Edsger W. Dijkstra', likes: 17});
    });

    test(' of all people multiple max', () => {
        expect(listHelper.mostLikes([blogs[1], blogs[1], blogs[3]])).toHaveProperty("likes", 10);
    });
});
