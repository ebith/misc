(function() {
  var apiKey, countryCode, ownedGamesCompleter, request, setup, steamId, subCommands;

  apiKey = liberator.globalVariables.steam_api || 'E912B5192623C96289A8EA2322E501DB';

  countryCode = liberator.globalVariables.countryCode || 'JP';

  if (!liberator.globalVariables.steam_id) {
    return liberator.echoerr('steam: need steam id');
  } else {
    steamId = liberator.globalVariables.steam_id;
  }

  setup = function() {
    var options;
    options = {
      responseType: 'json',
      url: "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=" + apiKey + "&steamid=" + steamId + "&format=json&include_appinfo=1"
    };
    return request(options, function(res) {
      if (res.status === 200) {
        return this.games = res.response.response.games;
      }
    });
  };

  ownedGamesCompleter = function(context, args) {
    context.title = ['Title', 'Total playtime'];
    context.keys = {
      text: 'appid',
      description: 'playtime',
      icon: 'icon'
    };
    context.process = [
      function(item, text) {
        return new TemplateXML("<span highlight=\"CompIcon\"><img src=\"" + item.icon + "\"/></span><span class=\"td-strut\"/>" + (util.escapeHTML(item.item.name)));
      }
    ];
    context.filters = [
      function(item) {
        return this.match(item.item.name);
      }
    ];
    context.completions = (function() {
      var game, list;
      list = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = games.length; _i < _len; _i++) {
          game = games[_i];
          _results.push({
            appid: game.appid,
            name: game.name,
            playtime: (game.playtime_forever / 60).toFixed(1),
            icon: "http://media.steampowered.com/steamcommunity/public/images/apps/" + game.appid + "/" + game.img_icon_url + ".jpg"
          });
        }
        return _results;
      })();
      switch (args['-sort']) {
        case 'playtime':
          list.sort(function(a, b) {
            return a.playtime - b.playtime;
          });
          break;
        case 'playtime!':
          list.sort(function(a, b) {
            return b.playtime - a.playtime;
          });
          break;
        case 'title!':
          list.sort(function(a, b) {
            return b.name.localeCompare(a.name);
          });
          break;
        default:
          list.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
      }
      return list;
    })();
    return context.compare = CompletionContext.Sort.unsorted;
  };

  subCommands = [
    new Command('o[pen]', 'open store page', function(args) {
      return liberator.open("http://store.steampowered.com/app/" + args + "/", liberator.NEW_TAB);
    }, {
      literal: 0,
      options: [[['-sort', '-s'], commands.OPTION_STRING, null, [['title', ''], ['title!', ''], ['playtime', ''], ['playtime!', '']]]],
      completer: ownedGamesCompleter
    }), new Command('s[earch]', 'search and open store page', function(args) {
      if (/\d+/.test(args)) {
        return liberator.open("http://store.steampowered.com/app/" + args + "/", liberator.NEW_TAB);
      } else {
        return liberator.open("http://store.steampowered.com/search/?cc=" + countryCode + "&category1=998&sort_order=ASC&term=" + args, liberator.NEW_TAB);
      }
    }, {
      literal: 0,
      completer: function(context, args) {
        var options;
        context.title = ['Title', 'Released'];
        context.keys = {
          text: 'appid'
        };
        context.compare = CompletionContext.Sort.unsorted;
        context.process = [
          function(item, text) {
            return new TemplateXML("<span highlight=\"CompIcon\"></span><span class=\"td-strut\"/>" + (util.escapeHTML(item.item.name)));
          }, function(item, text) {
            return new TemplateXML("" + (util.escapeHTML(item.item.released)));
          }
        ];
        context.filters = [];
        if (args.literalArg.length > 2) {
          context.incomplete = true;
          options = {
            responseType: 'document',
            url: "http://store.steampowered.com/search/results?cc=" + countryCode + "&category1=998&sort_order=ASC&term=" + args
          };
          return request(options, function(res) {
            var elem, _i, _len, _ref;
            context.incomplete = false;
            _ref = res.response.getElementById('search_result_container').getElementsByTagName('a');
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              elem = _ref[_i];
              liberator.log({
                elem: elem,
                appid: elem.href.match(/app\/(\d+)\//)[1],
                name: elem.getElementsByClassName('title').textContent,
                released: elem.getElementsByClassName('search_released')[0].textContent
              });
            }
            if (res.status === 200 && res.response.getElementById('search_result_container')) {
              return context.completions = (function() {
                var _j, _len1, _ref1, _results;
                _ref1 = res.response.getElementById('search_result_container').getElementsByTagName('a');
                _results = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  elem = _ref1[_j];
                  _results.push({
                    appid: elem.href.match(/app\/(\d+)\//)[1],
                    name: elem.getElementsByClassName('title')[0].textContent,
                    released: elem.getElementsByClassName('search_released')[0].textContent
                  });
                }
                return _results;
              })();
            }
          });
        }
      }
    }), new Command('p[lay]', 'play game', function(args) {
      return liberator.open("steam://run/" + args);
    }, {
      literal: 0,
      options: [[['-sort', '-s'], commands.OPTION_STRING, null, [['title', ''], ['title!', ''], ['playtime', ''], ['playtime!', '']]]],
      completer: ownedGamesCompleter
    })
  ];

  commands.addUserCommand(['steam'], 'steam', function(args) {
    return liberator.open('steam://');
  }, {
    subCommands: subCommands
  }, true);

  request = function(options, callback) {
    var body, key, value, xhr, _ref, _ref1, _ref2;
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
    xhr.responseType = (_ref2 = options.responseType) != null ? _ref2 : 'text';
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        return callback(xhr);
      }
    };
    body = (function() {
      var _ref3, _results;
      _ref3 = options.body;
      _results = [];
      for (key in _ref3) {
        value = _ref3[key];
        _results.push("" + (encodeURIComponent(key)) + "=" + (encodeURIComponent(value)));
      }
      return _results;
    })();
    return xhr.send(options.body ? body.join('&') : null);
  };

  setup();

}).call(this);
