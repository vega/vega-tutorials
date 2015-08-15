// CSS id prefix for vega components
var ID_PREFIX = 'vega_vis_';

var vega = function(converter) {
  var matches = [];
  return [
    { 
      type: 'lang',
      regex: /```!vega([^]+?)```/g,
      replace: function(s, match) {
        // replace vega JSON code blocks with component
        matches.push(match);
        var n = matches.length - 1;
        return '<div id="' + ID_PREFIX + n + '"></div>';
      }
    },
    { 
      type: 'lang',
      regex: /`!vega([^]+?)`/g,
      replace: function(s, match) { 
        // replace vega one-liner (e.g., spec file load) with component
        matches.push(match);
        var n = matches.length - 1;
        return '<div id="' + ID_PREFIX + n + '"></div>';
      }
    },
    {
      type: 'output',
      filter: function (text) {
        // Add vega initialization to end of page
        var script = '<script>\n';
        for (var i=0; i<matches.length; ++i) {
          script += vega_invoke(ID_PREFIX+i, matches[i]) + ';\n';
        }
        script += '</script>';
        matches = []; // reset array
        return text + '\n' + script;
      }
    }
  ]
};

function vega_invoke(id, markdown) {
  // setup params -> signals.
  var lines = markdown.trim().split(/\r?\n/),
      args  = lines[0],
      i, len, a, params = [];

  if (args[0] === '(') {
    args = lines.shift()
      .replace(/[\(\)]/g, '')
      .split(',');

    for(i=0, len=args.length; i<len; ++i) {
      a = args[i].trim().split(/[\s=]/);
      params.push({ type: a[0], name: a[1], value: a[2] });
    }
  }

  // map vega spec / filename to JS string
  var spec = lines.join('\n')
    .replace(/'/g, '\\\'')
    .replace(/\n/g, '\\n');

  // add call to create new vega component
  return 'vg.component(\'#' + id + '\', \'' + spec +
    '\', \'' + JSON.stringify(params) + '\')';
}

module.exports = vega;