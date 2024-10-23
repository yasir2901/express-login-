
const express = require('express');
const app = express();
var jwt = require('jsonwebtoken');
const secretKey = 'yasir@1'
app.use(express.json());

let uData = [{
    email: "m123@gmail.com",
    password: "123@4",
    id: 1,
    role: "super Admin",
    posts: []
}, {
    email: "123@gmail.com",
    password: "12@4",
    id: 2,
    role: "Admin",
    posts: [{
        id: 2,
        content: "This is Admin Post",
        likes: [],
        comments: []
    }]
}, {
    email: "y123@gmail.com",
    password: "1234",
    id: 3,
    role: "User",
    posts: [{
        id: 3,
        content: "This is User's Post",
        likes: [],
        comments: []
    }]
}, {
    email: "y123@gmail.com",
    password: "1234",
    id: 4,
    role: "User",
    posts: [{
        id: 4,
        content: "This is User's Post",
        likes: [],
        comments: []
    }]
}]

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/login', function (req, res) {
    let { email, password } = req.body;
    let user = uData.find(u => u.email === email && u.password === password);

    if (user) {
        let token = jwt.sign({ email: req.body.email, }, secretKey);
        return res.status(200).json({
            message: "You are logged in",
            token
        })
    } else {
        return res.status(401).json({
            message: "Email or password is invalid",
        })
    }
})

app.get('/isLoggedIn', authenticate, (req, res) => {
    let user = req.user;
    return res.status(200).json({
        message: "Welcome",
        user
    })
})
function authenticate(req, res, next) {
    let token = req.headers.token;
    if (!token) {
        return res.status(401).json({
            message: "Not logged In."
        })
    }
    var decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
}

app.get('/posts', authenticate, (req, res) => {
    let allPosts = uData.flatMap(user => {
        return user.id !== req.user.id ? user.posts : [];
    });
    res.json(allPosts)
})
app.listen(3000, () => {
    console.log('Server running at PORT: 3000');
});