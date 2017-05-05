﻿var config = require('config.js');
var express = require('express');
var router = express.Router();
var User = require('../models/user');

// routes
router.post('/login', authenticate);
router.post('/register', registerUser);
router.get('/current', getCurrentUser);
router.put('/:_id', updateUser);
router.delete('/:_id', deleteUser);
router.get('/', getAll);

module.exports = router;

router.get('/me', me);

function me (req, res) {
    res.send(req.user);
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

function getAll (req,res) {
    var page = +req.query['page'];
    var limit = +req.query['limit'];
    User.paginate({},{page: page, limit: limit }, function (err, data) {
        res.send(data);
    });
};

function authenticate (req, res) {
    var body = req.body;
    User.authenticate(body.username, body.password)
        .then(function (token) {
            if (token) {
                // authentication successful
                res.send({ token: token, user: body });
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
    User.addUser(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
};

function updateUser(req, res) {
    User.updateUser(req.params._id, req.body)
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

