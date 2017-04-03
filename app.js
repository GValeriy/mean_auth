// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var morgan      = require('morgan');
// var mongoose = require('mongoose');
//
// var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
// var config = require('./config'); // get our config file
//
// app.use(express.static(__dirname + '/client'));
//
// // use body parser so we can get info from POST and/or URL parameters
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
//
// var Worker = require('./models/worker');
// var User = require('./models/user');
// var workers = require('./routes/workers');
// var users = require('./routes/users');
//
// //connect to mongoose
//
// var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
// mongoose.connect(config.database); // connect to database
//
// // use morgan to log requests to the console
// app.use(morgan('dev'));
//
// app.use('/api/workers', workers);
// app.use('/api/users', users);
//
// app.listen(port);
// console.log('Magic happens at http://localhost:' + port);
require('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var morgan      = require('morgan');
var config = require('./config'); // get our config file

// var config = require('config.json');
var mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// app.use(express.static(__dirname + '/client'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: config.secret, resave: false, saveUninitialized: true }));

// use JWT auth to secure the api
app.use('/api', expressJwt({ secret: config.secret }).unless({ path: ['/api/users/authenticate', '/api/users/register'] }));
app.use(morgan('dev'));
// routes
app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));


var Worker = require('./models/worker');
var User = require('./models/user');

var workers = require('./routes/workers');
var users = require('./routes/users');
mongoose.connect(config.connectionString); // connect to database
app.use('/workers', workers);
app.use('/users', users);


// make '/app' default route
app.get('/', function (req, res) {
    return res.redirect('/app');
});

// start server
var server = app.listen(3000, function () {
    console.log('Server listening at http://' + server.address().address + ':' + server.address().port);
});