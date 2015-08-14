var fs = require('fs'),
    convert = require('./convert');

var TUTORIAL_DIR = process.argv[2] || './tutorials/',
    OUTPUT_DIR = process.argv[3] || './build/';

build(TUTORIAL_DIR, OUTPUT_DIR);

function build(inputPath, outputPath) {
  // collect tutorial folders in input path
  var names = fs.readdirSync(inputPath).filter(function(file) {
    return fs.statSync(inputPath + file).isDirectory();
  });

  // generate output for each tutorial
  names.forEach(function(name) {
    convert(name, inputPath, outputPath);
  });
}