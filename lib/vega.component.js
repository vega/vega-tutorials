vg.component = function(id, vega) {
  // URL for loading specs into editor
  var EDITOR = 'http://localhost:3000/';
  var spec = vega;

  try {
    // if the spec is valid JSON, use parsed JSON
    spec = JSON.parse(vega);
  } catch (err) {
    // otherwise, we will treat the spec as a file URL
  }

  vg.parse.spec(spec, function(chart) {
    chart({el: id}).update();

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
        var win = window.open('');
        win.document.write('<pre>' + vega + '</pre>');
        win.document.title = 'Vega JSON';
        d3.event.stopPropagation();
      })
      .text('View Source');

    // add 'Open in Vega Editor' action
    ctrl.append('a')
      .attr('href', EDITOR + '?spec=' + encodeURIComponent(vega))
      .attr('target', '_blank')
      .text('Open in Vega Editor');
  });
};