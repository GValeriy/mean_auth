var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var paginate = require('express-paginate');

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());

Worker = require('./models/worker');

//connect to mongoose
mongoose.connect('mongodb://localhost/workerstore');
var db = mongoose.connection;

app.get('/', function (req,res) {
    res.send('Hello word');
});


app.get('/api/workers',function (req,res) {
    Worker.getWorkers(function (err, workers) {
        if(err){
            throw err;
        }
        res.json(workers);
    })
});

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