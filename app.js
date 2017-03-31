var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan      = require('morgan');
var mongoose = require('mongoose');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file

app.use(express.static(__dirname + '/client'));

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var Worker = require('./models/worker');
var User = require('./models/user');
var workers = require('./routes/workers');
var users = require('./routes/users');

//connect to mongoose

var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
mongoose.connect(config.database); // connect to database
app.set('superSecret', config.secret); // secret variable

// use morgan to log requests to the console
app.use(morgan('dev'));

app.use('/api/workers', workers);
app.use('/api/users', users);




app.listen(port);
console.log('Magic happens at http://localhost:' + port);