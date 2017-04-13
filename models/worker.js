var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config.js');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var Schema = mongoose.Schema;
//Workers Schema

var workerSchema = Schema({
    name:{
        type: String
    },
    patronymic:{
        type: String
    },
    post:{
        type: String
    },
    surname:{
        type: String
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
    role:{
        type: String
    },
    creator:
            { type: Number, ref: 'User' }

    // username:{
    //     type: String
    // },
    // hash:{
    //     type: String
    // }
});

// Users Schema
var userSchema = Schema({
    _id:{
        type: Number
    },
    name:{
        type: String
    },
    surname:{
        type: String
    },
    role:{
        type: String
    },
    username:{
        type: String
    },
    hash:{
        type: String
    }

});
//
// var userSchema = Schema({
//     _id     : Number,
//     name: String,
//     surname:String,
//     role:String,
//     username:String,
//     hash: String
//
// });

var personSchema = Schema({
    _id     : Number,
    name    : String,
    age     : Number,
    stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

var storySchema = Schema({
    creator : { type: Number, ref: 'Person' },
    title    : String,
    fans     : [{ type: Number, ref: 'Person' }]
});

var Story  = mongoose.model('Story', storySchema);
var Worker = module.exports = mongoose.model('Worker', workerSchema);
var User = module.exports = mongoose.model('User', userSchema);
var Person = mongoose.model('Person', personSchema);

var aaron = new User({ _id:0, name: 'Aaron',surname:"Paul", username: '22', password: "admin" });

// aaron.save(function (err) {
//     if (err) return handleError(err);

    var worker1 = new Worker({
        surname: "Once upon a timex.",
        _creator: aaron._id    // assign the _id from the person
    });

    worker1.save(function (err) {
        if (err) return handleError(err);
        // thats it!
    });



// User
//     .findOne({ username: '0' })
//     .populate('_creator')
//     .exec(function (err, story) {
//         if (err) return handleError(err);
//         console.log('The creator is ', story._creator.name, story._creator.age);
//         // prints "The creator is Aaron"
//     });


workerSchema.plugin(mongoosePaginate);



module.exports.paginate = Worker.paginate;

//GET workers
module.exports.getWorkers = function(callback, limit) {
    Worker.find(callback).limit(limit);
};

//GET worker
module.exports.getWorkerById = function(id, callback) {
    Worker.findById(id, callback);
};

//ADD worker
module.exports.addWorker = function(worker, callback) {
    Worker.create(worker, callback);
};

//UPDATE Worker
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
        // ,
        // role:worker.role,
        // username:worker.username
    };
    Worker.findOneAndUpdate(query, update, options, callback);
};

//DELETE Worker
module.exports.removeWorker = function(id,callback) {
    var query = {_id: id};
    Worker.remove(query, callback);
};

//GET user
module.exports.getUserById = function (_id) {
    var deferred = Q.defer();

    User.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user) {
            // return user (without hashed password)
            deferred.resolve(_.omit(user, 'hash'));
        } else {
            // user not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

// ADD user
module.exports.addUser = function(userParam, callback) {
    var user = _.omit(userParam, 'password');
    user.hash = bcrypt.hashSync(userParam.password, 10);
    User.create(user, callback);

};
module.exports.updateUser = function (_id, userParam) {
    var deferred = Q.defer();
    // VALIDATION
    User.findById(_id, function (err, user) {
        if (err) deferred.reject(err);

        if (user.username !== userParam.username) {
            // username has changed so check if the new username is already taken
            User.findOne(
                { username: userParam.username },
                function (err, user) {
                    if (err) deferred.reject(err);

                    if (user) {
                        // username already exists
                        deferred.reject('Username "' + req.body.username + '" is already taken')
                    } else {
                        updateUser();
                    }
                });
        } else {
            updateUser();
        }
    });
    function updateUser() {
        // fields to update
        var set = {
            name:userParam.name,
            surname:userParam.surname,
            username:userParam.username,
            role:userParam.role
        };

        // update password if it was entered
        if (userParam.password) {
            set.hash = bcrypt.hashSync(userParam.password, 10);
        }

        User.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }
    return deferred.promise;
};

// DELETE user
module.exports._delete = function (_id, callback) {
    var query ={_id: _id};
    User.remove(query, callback);
};

// AUTH user
module.exports.authenticate = function (username, password) {

    var deferred = Q.defer();

    User.findOne({ username: username }, function (err, user) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (user && bcrypt.compareSync(password, user.hash)) {
            // authentication successful
            deferred.resolve(jwt.sign({ sub: user._id }, config.secret));
        } else {
            // authentication failed
            deferred.resolve();
        }
    });
    return deferred.promise;
};