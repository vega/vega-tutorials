var fs = require('fs'),
    exec = require('child_process').exec,
    showdown = require('showdown'),
    converter = new showdown.Converter({
      extensions: [
        require('./showdown-vega')
      ]
    });

var HEADER1 = '<!DOCTYPE html><html><head>',
    STYLE = '<link rel="stylesheet" href="../style.css">' +
            '<link rel="stylesheet" href="../highlight.css">';
    HEADER2 = '</head><body>',
    FOOTER = '</body></html>',
    BASE = 'http://vega.github.io/vega-editor/vendor/';

var INCLUDES = [
  "topojson.js",
  "d3.min.js",
  "d3.geo.projection.min.js",
  "d3.layout.cloud.js",
  "vega.min.js"
];

function convert(name, inputPath, outputPath) {
  var path = inputPath + name + '/';
  var text = fs.readFileSync(path + 'Tutorial.md', 'utf8');
  var body = converter.makeHtml(text);
  var html = header(name) + body + footer();
  write(path, outputPath + name + '/', html);
}

function write(input, output, html) {
  // ensure output folder exists
  if (!fs.existsSync(output)) {
    fs.mkdirSync(output);
  }
  // copy folder contents
  var cmd = 'cp -r ' + input+'* ' + output;
  exec(cmd, function(error/*, stdout, stderr*/) {
    if (error) console.error(error);
  });
  // write index.html
  fs.writeFileSync(output + 'index.html', html);
}

function header(title) {
  var title = '<title>Vega Tutorials: ' +
    title[0].toUpperCase() + title.slice(1) + '</title>';
  var imports = INCLUDES.map(function(f) {
    return '<script src="' + BASE + f + '" charset="utf-8"></script>';
  }).join('');
  imports += '<script src="../vega.component.js"></script>';
  imports += '<script src="../highlight.min.js"></script>';
  imports += '<script>hljs.initHighlightingOnLoad();</script>';
  return HEADER1 + title + STYLE + imports + HEADER2;
}

function footer() {
  return FOOTER;
}

module.exports = convert;