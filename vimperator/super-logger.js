(function() {
  liberator.registerObserver('enter', function() {
    return libly.$U.around(liberator, 'log', (function(next, _arg) {
      var flag, msg, path, _ref;
      msg = _arg[0], flag = _arg[1];
      path = (_ref = liberator.globalVariables.log_writer_logfile_path) != null ? _ref : '~/.vimperator.log';
      if (window.growlgntp) {
        growlgntp.growl.register('Vimperator', 'http://vimperator.org/favicon.ico', [
          {
            name: 'QB',
            displayName: 'echo'
          }, {
            name: 'super-logger',
            displayName: 'log'
          }
        ]);
      }
      if (typeof msg === "object") {
        msg = Cc["@mozilla.org/feed-unescapehtml;1"].getService(Ci.nsIScriptableUnescapeHTML).unescape(util.objectToString(msg, false).value);
      }
      switch (flag) {
        case 'write':
          (io.File(path)).write("" + msg + "\n", '>>');
          break;
        case 'growl':
          growlgntp.growl.notify('Vimperator', 'super-logger', 'log', msg, null);
      }
      return services.get("console").logStringMessage(config.name.toLowerCase() + ": " + msg);
    }), true);
  });

}).call(this);
