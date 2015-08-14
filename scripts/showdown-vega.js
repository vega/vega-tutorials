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
  // map vega spec / filename to JS string
  var arg = markdown.trim()
    .replace(/'/g, '\\\'')
    .replace(/\n/g, '\\n');
  // add call to create new vega component
  return 'vg.component(\'#' + id + '\', \'' + arg + '\')';
}

module.exports = vega;