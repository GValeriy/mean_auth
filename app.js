require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var morgan = require('morgan');
var config = require('./config'); // get our config file

var mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));
app.use(morgan('dev'));

// routes
app.use('/login', require('./routes/login.controller.js'));
app.use('/register', require('./routes/register.controller.js'));
app.use('/app', require('./routes/app.controller.js'));
app.use('/api/users', require('./routes/users.controller.js'));
app.use('/workers', require('./routes/workers'));


// mongoose model
var Worker = require('./models/worker');

// connect to database
mongoose.connect(config.connectionString);

// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});