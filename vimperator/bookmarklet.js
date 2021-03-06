(function() {
  var map;

  map = {};

  commands.addUserCommand(['bookmarklet', 'bml'], 'run bookmarklet', function(args) {
    return liberator.open(map[args]);
  }, {
    completer: function(context, args) {
      var bookmarklet, list, _i, _len, _ref;
      list = [];
      _ref = bookmarks.get('javascript:');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bookmarklet = _ref[_i];
        map[bookmarklet.title] = bookmarklet.url;
        list.push([bookmarklet.title, bookmarklet.url]);
      }
      context.completions = list;
      return context.compare = CompletionContext.Sort.unsorted;
    }
  }, true);

}).call(this);
