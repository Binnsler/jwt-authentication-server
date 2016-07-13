// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');

// DB Setup
mongoose.connect('mongodb://localhost:auth/auth');

// App Setup
// Getting express working how we want
app.use(morgan('combined')); // Express middleware: logging requests to console
app.use(bodyParser.json({type: '*/*'})); // Express middleware: parse incoming requests into json no matter what the type is
router(app);

// Server Setup
// Getting express application to talk to the outside world
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on: ', port);
// http is a native Node library used for working low level with incoming http requests. When http requests come in, they are forwarded to the server we named 'app'.
