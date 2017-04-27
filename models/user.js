var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config.js');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var Schema = mongoose.Schema;

// *******   User`s schema   ******* //

var userSchema = Schema({
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
    },
    patronymic:{
        type: String
    },
    post:{
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
    }
});

userSchema.plugin(mongoosePaginate);
var User = module.exports = mongoose.model('User', userSchema);

module.exports.paginate = User.paginate;

// *******   CRUD User   ******* //

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
};
//GET users
module.exports.getWorkers = function(callback, limit) {
    User.find(callback).limit(limit);
};
// ADD user
module.exports.addUser = function(userParam) {
    var deferred = Q.defer();
    // VALIDATION
    User.findOne(
        { username: userParam.username },
        function (err, user) {
            if (err)
                deferred.reject(err);
            if (user) {
                // username already exists
                deferred.reject('Username "' + userParam.username + '" is already taken');
            } else {
                createUser();
            }
        });

    function createUser() {
        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');

        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);

        User.create(
            user,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    };
    return deferred.promise;
};
// UPDATE user
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
            role:userParam.role,
            patronymic:userParam.patronymic,
            post:userParam.post,
            sex:userParam.sex,
            phone:userParam.phone,
            work_start:userParam.work_start,
            work_stop:userParam.work_stop
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
    };
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
        if (err) deferred.reject(err);

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
