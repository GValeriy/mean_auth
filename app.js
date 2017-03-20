var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

var Worker = require('./models/worker');
var workers = require('./routes/workers');

//connect to mongoose
mongoose.connect('mongodb://localhost/workerstore');
var db = mongoose.connection;

app.use('/api/workers', workers);

app.listen(3000);
console.log('Running on port 3000');