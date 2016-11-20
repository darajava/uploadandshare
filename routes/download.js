var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var mongoose = require('mongoose');

router.get('/:id', function(req, res){
  res.render('download', { hash: req.params.id });
});

router.get('/:hash/:name', function(req, res){
  res.set('Content-Type', 'application/octet-stream');
  res.set('Content-Disposition', 'attachment; filename="' + req.params.name + '"');

  fs.readFile('/home/darajava/uploadandshare.link/uploads/' + req.params.hash + '/' + req.params.name, (err, data) => {
    if (err) res.send('lol');
    
    fs.unlink('/home/darajava/uploadandshare.link/uploads/' + req.params.hash + '/' + req.params.name); 
    res.send(data);
  });
});

router.post('/', function (req, res) {
  var fileSchema = mongoose.Schema({
    name: String,
    hash: String,
    time: {type: Date, default: Date.now},
    filepath: String
  });


  if (mongoose.models.File) {
    var File = mongoose.model('File');
  } else {
    var File = mongoose.model('File', fileSchema);
  }
  
  File.findOne({ 'hash': req.body.hash }, 'hash name', function (err, file) {
    if (err) return handleError(err);
    res.send(file);
  });

});

module.exports = router;
