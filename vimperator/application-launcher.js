(function() {
  var AL;

  AL = {
    apps: {},
    dirs: function() {
      var dirPath, dirs, enumDir, roots, _i, _len;
      if (liberator.has('MacUnix')) {
        return ['/Applications', '~/Applications'];
      } else if (liberator.has('Windows')) {
        roots = [FileUtils.getFile('Progs', []).parent.path, FileUtils.getFile('CmPrgs', []).parent.path];
        dirs = [];
        for (_i = 0, _len = roots.length; _i < _len; _i++) {
          dirPath = roots[_i];
          dirs.push(dirPath);
          (enumDir = function(dirPath) {
            var dir, entries, entry, _results;
            dir = new FileUtils.File(dirPath);
            if (!dir.isSpecial()) {
              entries = dir.directoryEntries;
              _results = [];
              while (entries.hasMoreElements()) {
                entry = entries.getNext().QueryInterface(Ci.nsIFile);
                if (entry.isDirectory()) {
                  dirs.push(entry.path);
                  _results.push(enumDir(entry.path));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          })(dirPath);
        }
        return dirs;
      }
    },
    filter: function(app) {
      if (liberator.has('MacUnix')) {
        return /\.app$/.test(app.path);
      } else if (liberator.has('Windows')) {
        return /\.(exe|lnk)$/.test(app.path);
      }
    },
    init: function() {
      Cu["import"]('resource://gre/modules/FileUtils.jsm');
      this.appScan();
      return commands.addUserCommand(['applicationLauncher', 'al'], 'Application Launcher', function(args) {}, {
        subCommands: [
          new Command('scan', 'scan application dirs', (function(_this) {
            return function(args) {
              return _this.appScan();
            };
          })(this)), new Command('launch', 'launch application', (function(_this) {
            return function(args) {
              var _ref;
              return (_ref = _this.apps[args]) != null ? _ref.launch() : void 0;
            };
          })(this), {
            completer: (function(_this) {
              return function(context, args) {
                var app, key;
                context.completions = (function() {
                  var _ref, _results;
                  _ref = this.apps;
                  _results = [];
                  for (key in _ref) {
                    app = _ref[key];
                    _results.push([app.leafName, app.path]);
                  }
                  return _results;
                }).call(_this);
                return context.compare = CompletionContext.Sort.unsorted;
              };
            })(this)
          })
        ]
      }, true);
    },
    appScan: function() {
      var app, dir, dirPath, entries, _i, _len, _ref, _results;
      _ref = this.dirs();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dirPath = _ref[_i];
        dir = new FileUtils.File(dirPath);
        if (dir.exists() && !dir.isSpecial()) {
          entries = dir.directoryEntries;
          _results.push((function() {
            var _results1;
            _results1 = [];
            while (entries.hasMoreElements()) {
              app = entries.getNext().QueryInterface(Ci.nsIFile);
              if (this.filter(app)) {
                _results1.push(this.apps[app.leafName] = app);
              } else {
                _results1.push(void 0);
              }
            }
            return _results1;
          }).call(this));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    }
  };

  AL.init();

}).call(this);
