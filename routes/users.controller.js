var config = require('config.js');
var express = require('express');
var router = express.Router();
var User = require('../models/worker');

// routes
router.post('/authenticate', authenticateUser);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);

module.exports = router;

function authenticateUser(req, res) {
    User.authenticate(req.body.username, req.body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token });
            } else {
                // authentication failed
                res.status(401).send('Username or password is incorrect');
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
};

function registerUser(req, res) {
    var user = req.body;
    User.addUser(user, function (err, user) {
        if(err){
            // throw err;
            res.status(400).send(err);
        }
        res.json(user);
    })
};


function getCurrentUser(req, res) {
    User.getUserById(req.user.sub)
        .then(function (user) {
            if (user) {
                res.send(user);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
};


function updateUser(req, res) {
    var userId = req.user.sub;
    if (req.params._id !== userId) {
        // can only update own account
        return res.status(401).send('You can only update your own account');
    };
    User.updateUser(userId, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
};

function deleteUser(req, res) {

    var id = req.params._id;
    User._delete(id, function (err, user) {
        if(err){
            throw err;
        }
        res.json(user);
    })

};

