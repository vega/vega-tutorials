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

  vg.component = function(id, vega, params) {
    var spec = vega,
        data, sg, i, len, p, view;

    try {
      // if the spec is valid JSON, use the parsed JSON
      spec = JSON.parse(vega);
      params = JSON.parse(params);

      // populate params as signals
      sg = spec.signals || (spec.signals = []);
      for (i=0, len=params.length; i<len; ++i) {
        sg.push({
          name: params[i].name, 
          init: params[i].value,
          streams: [{
            type: id+'_'+params[i].name+':mousemove', 
            expr: 'event.target.value'
          }]
        });
      }

      data = {spec: vega};
    } catch (err) {
      // otherwise, treat as a file string
      data = {file: vega};
    }

    vg.parse.spec(spec, function(chart) {
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

      if (params.length) {
        ctrl = d3.select(id).append('div')
          .attr('class', 'aside')
          .append('p');

        for (var i = 0, len=params.length, p, t; i<len; ++i) {
          p = params[i];
          t = p.type;

          if (t.match('num')) {
            var range = t.replace('num', '')
              .replace(/[\[\]]/g, '')
              .trim()
              .split('-');

            ctrl.append('label')
              .text(p.name)
              .append('input')
                .attr('id', id.replace('#', '')+'_'+p.name)
                .attr('type', 'range')
                .attr('min', range[0])
                .attr('max', range[1])
                .attr('value', p.value);

            ctrl.append('br');
          }
        }
      }

      view = chart({el: id}).update();
    });

    function shimParams(source) {
      if (!params.length) return source;
      for (var i=0, len=params.length, p; i<len; ++i) {
        p = params[i];
        var re = new RegExp('\{"signal": "'+p.name+'"\}', 'g');
        source = source.replace(re, view.signal(p.name));
      }

      return source;
    }

    function viewSource(source) {
      var win = window.open('');
      win.document.write(HEADER + shimParams(source) + FOOTER);
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
