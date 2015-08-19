var fs = require('fs'),
    showdown = require('showdown'),
    converter = new showdown.Converter({
      extensions: [ require('./showdown-vega') ]
    });

var OUTPUT_DIR = process.argv[3] || './build/';

var BASE      = 'http://vega.github.io/vega-editor/vendor/',
    HEADER_OPEN  = '<!DOCTYPE html><html><head>',
    HEADER_CLOSE = '</head><body>',
    FOOTER    = '</body></html>',
    STYLE     = '<link rel="stylesheet" href="{{DIR}}style.css">',
    HL_STYLE  = '<link rel="stylesheet" href="{{DIR}}highlight.css">',
    HL_IMPORT = '<script src="{{DIR}}highlight.min.js"></script>',
    HL_INIT1  = '<script>hljs.initHighlightingOnLoad();</script>',
    HL_INIT2  = '<script>hljs.initHighlighting();</script>',
    VG_EMBED  = '<script>' +
      "vg.embed.config.source_header = '" + escape(HL_STYLE + HL_IMPORT) + "';" +
      "vg.embed.config.source_footer = '" + escape(HL_INIT2) + "';" +
      '</script>'.replace('{{DIR}}', '../');

var INCLUDES = [
  "topojson.js",
  "d3.min.js",
  "d3.geo.projection.min.js",
  "d3.layout.cloud.js",
  "vega.min.js",
  "vega-embed.min.js"
].map(script).join('');

build(OUTPUT_DIR);

function build(dir) {
  // collect tutorial folders in input path
  var names = fs.readdirSync(dir).filter(function(file) {
    return fs.statSync(dir + file).isDirectory();
  });
  // generate output for each tutorial
  names.forEach(function(name) { convert(name, dir); });
  // generate index page
  index(dir);
}

function index(dir) {
  var text = fs.readFileSync(dir + 'Index.md', 'utf8'),
      body = converter.makeHtml(text),
      html = header('Vega Tutorials').replace(/{{DIR}}/g, '') + body + FOOTER;
  fs.writeFileSync(dir + 'index.html', html);
}

function convert(name, dir) {
  var path = dir + name + '/',
      text = fs.readFileSync(path + 'Tutorial.md', 'utf8'),
      body = converter.makeHtml(text),
      title = 'Vega Tutorial: ' + name[0].toUpperCase() + name.slice(1),
      html = header(title).replace(/{{DIR}}/g, '../') + body + FOOTER;
  fs.writeFileSync(path + 'index.html', html);
}

function header(title) {
  return HEADER_OPEN + '<title>'+title+'</title>' + STYLE + HL_STYLE +
    INCLUDES + HL_IMPORT + HL_INIT1 + VG_EMBED + HEADER_CLOSE;
}

function script(f) { 
  return '<script src="' + BASE + f + '" charset="utf-8"></script>';
}

function escape(s) {
  return s.replace(/</g, '\\<').replace(/>/g, '\\>');
}
