/*global require, console, process*/
(function() {
  'use strict';

  var cwd = '.';
  var teplatePattern = /\.tpl\.json$/;
  var bowerFilename = 'bower.json';
  var output = {};

  var fs = require('fs');
  var deepExtend = require('deep-extend');
  var path = require('path');

  var loadJsonFile = function(filename) {
    var data;
    try {
      data = JSON.parse(fs.readFileSync(filename));
    } catch (e) {
      console.log(filename + ' is not a json file');
      process.exit(1);
    }
    return data;
  };

  fs.readdir(cwd, function(err, files) {
    if (err) {
      throw err;
    }
    files.map(function(file) {
      return path.join(cwd, file);
    }).filter(function(file) {
      return fs.statSync(file).isFile();
    }).forEach(function(file) {
      if (teplatePattern.test(file)) {
        console.log('Merging', file);
        deepExtend(output, loadJsonFile(file));
        fs.writeFileSync(bowerFilename, JSON.stringify(output, null,
          4));
      }
    });
  });

})();
