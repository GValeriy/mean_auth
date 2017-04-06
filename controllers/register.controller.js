var express = require('express');
var router = express.Router();
var request = require('request');
var config = require('config.js');
var Worker = require('../models/worker');

router.get('/', function (req, res) {

    Worker.paginate({},{page: 5, limit: 100 }, function (err, data) {

        if(data.total ===null)
        res.render('registerAdmin');
        res.render('register');

    });


});

router.post('/', function (req, res) {
    // register using api to maintain clean separation between layers
    request.post({
        url: config.apiUrl + '/users/register',
        form: req.body,
        json: true
    }, function (error, response, body) {
        if (error) {
            return res.render('register', { error: 'An error occurred' });
        }

        // Worker.paginate({},{page: 5, limit: 100 }, function (err, data) {
        //
        //     console.log(data.total);

            // if (response.statusCode !== 200 ) {
            //     return res.render('register', {
            //         error: response.body,
            //         name: req.body.name,
            //         surname: req.body.surname
            //         ,
            //         role:
            //     });
            // }
        // });

        if (response.statusCode !== 200 ) {
            return res.render('register', { error: response.body});
        }

        // return to login page with success message
        req.session.success = 'Registration successful';
        return res.redirect('/login');
    });
});

module.exports = router;