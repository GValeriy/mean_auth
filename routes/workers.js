var express = require('express');
var router = express.Router();
var Worker = require('../models/worker');

router.get('/',function (req,res) {

    Worker.paginate({},{page: req.query['page'], limit: req.query['limit'] }, function (err, data) {
        res.send(data);
    });
});

router.get('/:_id',function (req,res) {
    Worker.getWorkerById(req.params._id, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

router.get('/:search',function (req,res) {
    Worker.searchWorker ( req.params.name, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

router.post('/',function (req,res) {
    var worker = req.body;
    Worker.addWorker(worker, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

router.put('/:_id',function (req,res) {
    var id = req.params._id;
    var worker = req.body;
    Worker.updateWorker(id, worker, {}, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});

router.delete('/:_id',function (req,res) {
    var id = req.params._id;
    Worker.removeWorker(id, function (err, worker) {
        if(err){
            throw err;
        }
        res.json(worker);
    })
});


module.exports = router;
