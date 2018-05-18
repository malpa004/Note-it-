var express = require('express');
var router = express.Router();

// simple API call, no authentication or user info
router.post('/getAllLists', function(req, res, next) {

  var userId = req.body.userid;
  req.db.collection('lists').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }
    res.json({
      lists: results
    });
  });

});
