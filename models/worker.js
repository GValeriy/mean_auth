var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//Workers Schema

var workerSchema = mongoose.Schema({
    name:{
        type: String,
        // required:true
    },
    patronymic:{
        type: String
    },
    post:{
        type: String,
        // required:true
    },
    surname:{
        type: String,
        // required:true
    },
    sex:{
        type: String
    },
    phone:{
        type: String
    },
    work_start:{
        type: String
    },
    work_stop:{
        type: String
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});

workerSchema.plugin(mongoosePaginate);

var Worker = module.exports = mongoose.model('Worker', workerSchema);

module.exports.paginate = Worker.paginate;

//GET workers
module.exports.getWorkers = function(callback, limit) {
    Worker.find(callback).limit(limit);
};

//Get worker
module.exports.getWorkerById = function(id, callback) {
    Worker.findById(id, callback);
};

// Searching
module.exports.searchWorker = function(callback) {
Worker.find({ name: "Валерий" });
};

//ADD worker
module.exports.addWorker = function(worker, callback) {
    Worker.create(worker, callback);
};

//Update Worker
module.exports.updateWorker = function (id, worker, options, callback) {
    var query = {_id: id};
    var update = {
        name:worker.name,
        patronymic:worker.patronymic,
        post:worker.post,
        surname:worker.surname,
        sex:worker.sex,
        phone:worker.phone,
        work_start:worker.work_start,
        work_stop:worker.work_stop
    };
    Worker.findOneAndUpdate(query, update, options, callback);
};

//Delete Worker
module.exports.removeWorker = function(id,callback) {
    var query = {_id: id};
    Worker.remove(query, callback);
};