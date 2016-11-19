var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

router.get('/:id', function(req, res){
  res.render('download', { hash: req.params.id });
});

module.exports = router;
