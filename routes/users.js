var express = require('express');
var router = express.Router();
var Worker = require('../models/worker');

/* GET users listing. */
// router.get('/', function (req, res, next) {

//
//     User.paginate({},{page: 4, limit: 3}, function (err, data) {
//         res.send(data);
//     });
//
//     // User.find({}, function (err, data) {
//     //     res.send(data);
//     // });
//
// });

router.get('/',function (req,res) {

    // console.log(req.query);
    // res.send('OK');

    Worker.paginate({},{page: req.query['page'], limit: req.query['limit']}, function (err, data) {


        res.send(data);

    });


});





module.exports = router;
