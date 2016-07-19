(function() {

  // URL for loading specs into editor
  var EDITOR = 'http://vega.github.io/vega-editor/';

  var HEADER = '<html><head>' +
    '<link rel="stylesheet" href="../highlight.css">' +
    '<script src="../highlight.min.js"></script>' +
    '</head><body><pre><code class="json">';

  var FOOTER = '</code></pre>' +
    '<script>hljs.initHighlighting();</script>' +
    '</body></html>';

  vg.component = function(id, vega) {
    var spec = vega,
        data;

    try {
      // if the spec is valid JSON, use the parsed JSON
      spec = JSON.parse(vega);
      data = {spec: vega};
    } catch (err) {
      // otherwise, treat as a file string
      data = {file: vega};
    }

    vg.parse.spec(spec, function(chart) {
      var view = chart({el: id}).update();

      // ensure container div has class 'vega-component'
      // add child div to house action links
      var ctrl = d3.select(id)
        .attr('class', 'vega-component')
        .append('div')
        .attr('class', 'vega-actions');

      // add 'View Source' action
      ctrl.append('a')
        .attr('href', '#')
        .on('click', function() {
          viewSource(vega); // TODO get source from vg.view?
          d3.event.preventDefault();
        })
        .text('View Source');

      // add 'Open in Vega Editor' action
      ctrl.append('a')
        .attr('href', '#')
        .on('click', function() {
          post(EDITOR, data);
          d3.event.preventDefault();
        })
        .text('Open in Vega Editor');
    });

    function viewSource(source) {
      var win = window.open('');
      win.document.write(HEADER + source + FOOTER);
      win.document.title = 'Vega JSON Source';
    }

    // open url in a new window, and pass a message
    function post(url, data) {
      var editor = window.open(url),
          wait = 10000,
          step = 250,
          count = ~~(wait/step);

      function listen(evt) {
        if (evt.source === editor) {
          count = 0;
          window.removeEventListener('message', listen, false);
        }
      }
      window.addEventListener('message', listen, false);

      // send message
      // periodically resend until ack received or timeout
      function send() {
        if (count <= 0) return;
        editor.postMessage(data, '*');
        setTimeout(send, step);
        count -= 1;
      }
      setTimeout(send, step);
    }
  };

})();
