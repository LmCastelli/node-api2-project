// implement your server here
const express = require('express');
const portsRouter = require('./posts/posts-router')
const server = express();

server.use(express.json());

server.use('/api/posts', portsRouter)

// require your posts router and connect it here


module.exports = server;