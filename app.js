require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('./config'); // get our config file
var mongoose = require('mongoose');

app.use(express.static(__dirname + '/app'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use JWT auth to secure the app
app.use(expressJwt({ secret: config.secret,credentialsRequired: false }).unless({ path: [ '/api/users/login' ]}));

// routes
app.use('/api/users', require('./routes/users.controller.js'));

// connect to database
mongoose.connect(config.connectionString);

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});