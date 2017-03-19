var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var Worker = require('./models/worker');
var users = require('./routes/users');

//connect to mongoose
mongoose.connect('mongodb://localhost/workerstore');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Database connected successfully');
});


app.use('/api/workers', users);


app.get('/', function (req,res) {
    res.send('Hello word');
});

// app.get('/api/workers',function (req,res) {
//     Worker.getWorkers(function (err, workers) {
//         if (err) {
//             throw err;
//         }
//         res.json(workers);
//     })
// });



app.get('/api/workers/:_id',function (req,res) {
    Worker.getWorkerById(req.params._id, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

app.post('/api/workers',function (req,res) {
    var worker = req.body;
    Worker.addWorker(worker, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

app.put('/api/workers/:_id',function (req,res) {
    var id = req.params._id;
    var worker = req.body;
    Worker.updateWorker(id, worker, {}, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

app.delete('/api/workers/:_id',function (req,res) {
    var id = req.params._id;
    Worker.removeWorker(id, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

app.listen(3000);
console.log('Running on port 3000');