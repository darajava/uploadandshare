var express = require('express');
var router = express.Router();
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mongoose = require('mongoose');

var File = require('../models/file').File;

router.post('/', function(req, res){

  var hashmd5 = require('crypto').createHash('md5').update(Math.random() + 'sosaltylol').digest("hex").substring(5, 15);

  // create an incoming form object
  var form = new formidable.IncomingForm();

  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = false;

  fs.mkdir(path.join(__dirname, '../uploads/' + hashmd5));
  form.uploadDir = path.join(__dirname, '../uploads/' + hashmd5);
  
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
 
    var ipAddr = req.headers['x-forwarded-for'] || 
      req.connection.remoteAddress || 
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
 
    var fileObj = new File({
      name: file.name,
      hash: hashmd5,
      filepath: path.join(form.uploadDir, file.name),
      ip: ipAddr
    });

console.log(fileObj);

    fileObj.save(function (err, thisBlob) {
      if (err) return console.error(err);
    });
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.send(hashmd5);
  });

  // parse the incoming request containing the form data
  form.parse(req);
});

module.exports = router;
