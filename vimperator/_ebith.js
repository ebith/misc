(function() {
  var ebith;

  liberator.plugins.ebith = {};

  ebith = liberator.plugins.ebith;

  ebith.request = function(options, callback) {
    var body, key, value, xhr, _ref, _ref1;
    xhr = new XMLHttpRequest();
    xhr.open((_ref = options.method) != null ? _ref : 'GET', options.url);
    if (options.method === 'POST') {
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }
    _ref1 = options.headers;
    for (key in _ref1) {
      value = _ref1[key];
      xhr.setRequestHeader(key, value);
    }
    xhr.responseType = options.responseType || 'text';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        return callback(xhr);
      }
    };
    body = (function() {
      var _ref2, _results;
      _ref2 = options.body;
      _results = [];
      for (key in _ref2) {
        value = _ref2[key];
        _results.push("" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(value)));
      }
      return _results;
    })();
    if (options.overrideMimeType) {
      xhr.overrideMimeType(options.overrideMimeType);
    }
    return xhr.send(options.body ? body.join('&') : null);
  };

}).call(this);
