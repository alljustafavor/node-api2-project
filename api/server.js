const express = require('express');
const post_router = require('./posts/posts-router')

const server = express();
server.use(express.json());
server.use('/api/posts', post_router)

server.get('/', (req, res) => {
    res.json('Hello World!');
});


module.exports = server;