(function() {
  var request, sites;

  sites = liberator.globalVariables.meisai || {
    saison: {
      description: 'SAISON CARD Netアンサー',
      icon: 'http://www.saisoncard.co.jp/favicon.ico',
      login: {
        url: 'https://netanswerplus.saisoncard.co.jp/WebPc/USA0100BLC01.do',
        extra: {
          'org.apache.struts.taglib.html.TOKEN': function() {
            var options;
            options = {
              url: 'https://netanswerplus.saisoncard.co.jp/WebPc/welcomeSCR.do',
              responseText: 'document'
            };
            return request(options, function(res) {
              return res.response.getElementsByName('org.apache.struts.taglib.html.TOKEN')[0];
            });
          }
        }
      },
      meisai: {
        url: 'https://netanswerplus.saisoncard.co.jp/WebPc/USC0101BLC01.do'
      }
    },
    idemitsu: {
      description: '出光カード ウェブステーション',
      icon: 'http://www.idemitsucard.com/favicon.ico',
      login: {
        url: 'https://ws.idemitsucard.com/PC-IM/USA0100BLC01.do',
        extra: {
          'org.apache.struts.taglib.html.TOKEN': function() {
            var options;
            options = {
              url: 'https://ws.idemitsucard.com/PC-IM/welcomeSCR.do',
              responseText: 'document'
            };
            return request(options, function(res) {
              return res.response.getElementsByName('org.apache.struts.taglib.html.TOKEN')[0];
            });
          }
        }
      },
      meisai: {
        url: 'https://ws.idemitsucard.com/PC-IM/USC0101BLC01.do'
      }
    }
  };

  commands.addUserCommand(['meisai'], '', function(args) {
    var login, options, site, uri;
    if (site = sites[args[0]]) {
      uri = util.newURI(site.login.url);
      login = Cc['@mozilla.org/login-manager;1'].getService(Ci.nsILoginManager).findLogins({}, uri.prePath, '', null)[0];
      options = {
        method: 'POST',
        url: uri.spec,
        body: site.login.extra || {}
      };
      options.body[login.usernameField] = login.username;
      options.body[login.passwordField] = login.password;
      return request(options, function(res) {
        return liberator.open(site.meisai.url, liberator.NEW_TAB);
      });
    } else {
      return liberator.echoerr("meisai: " + args[0] + " is undefined");
    }
  }, {
    completer: function(context, args) {
      var key, site;
      if (args.completeArg > 0) {
        return;
      }
      context.completions = (function() {
        var _ref, _ref1, _results;
        _results = [];
        for (key in sites) {
          site = sites[key];
          _results.push([key, (_ref = site.description) != null ? _ref : '', (_ref1 = site.icon) != null ? _ref1 : util.createURI(site.login.url).prePath + '/favicon.ico']);
        }
        return _results;
      })();
      context.keys = {
        text: 0,
        description: 1,
        icon: function(item) {
          return item[2] || DEFAULT_FAVICON;
        }
      };
      return context.compare = CompletionContext.Sort.unsorted;
    }
  }, true);

  request = function(options, callback) {
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
