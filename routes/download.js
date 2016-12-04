var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');

var File = require('../models/file').File;

router.get('/:id', function(req, res){
  File.findOne({ 'hash': req.params.id }, 'hash name', function (err, file) {
    if (err) {
      res.render('error', { error: 'no file here' });
      return;
    }

    if (file) {
      fs.stat('/home/darajava/uploadandshare.link/uploads/' + file.hash + '/' + file.name, function(err, stat) {
        if(err == null) {
          res.render('download', { hash: req.params.id });
        } else if(err.code == 'ENOENT') {
          // file does not exist
          res.render('error', { error: 'no file here' });
        } else {
          res.render('download', { hash: req.params.id });
        }
      });
    } else {
      res.render('error', { error: 'no file here' });
    }
  });
});

router.get('/:hash/:name', function(req, res){
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', 'attachment; filename="' + req.params.name + '"');

  fs.readFile('/home/darajava/uploadandshare.link/uploads/' + req.params.hash + '/' + req.params.name, (err, data) => {
    if (err) {
      res.status(404);
      res.send('ok');
      return;
    } else {
      res.set('Content-Type', 'application/octet-stream');
      res.set('Content-Disposition', 'attachment; filename="' + req.params.name + '"');

      fs.unlink('/home/darajava/uploadandshare.link/uploads/' + req.params.hash + '/' + req.params.name); 
      res.send(data);
    }
  });
});

router.post('/', function (req, res) {
  File.findOne({ 'hash': req.body.hash }, 'hash name', function (err, file) {
    if (err) return handleError(err);
    res.send(file);
  });
});

module.exports = router;
