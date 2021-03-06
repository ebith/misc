(function() {
  var sites;

  sites = liberator.globalVariables.yaopen || {
    codic: {
      icon: 'http://codic.jp/favicon.gif',
      url: 'http://codic.jp/search?q=%ARG%'
    },
    wolframAlpha: {
      icon: 'http://www.wolframcdn.com/images/alpha.fav.png',
      url: 'http://www.wolframalpha.com/input/?i=%ARG%'
    },
    '2ch': {
      url: 'http://find2ch.net/search?q=%ARG%'
    },
    tiqav: {
      icon: 'http://tiqav.com/images/favicon.ico',
      url: 'http://tiqav.com/search/%ARG%'
    },
    isthereanydeal: {
      icon: 'http://s3-eu-west-1.amazonaws.com/itad/images/favicon.png',
      url: 'http://isthereanydeal.com/#/search:%ARG%;/scroll:#gamelist'
    },
    devdocs: {
      description: 'API Document Browser',
      url: 'http://devdocs.io/#q=%ARG%'
    },
    mdn: {
      description: 'Mozilla Developer Network',
      icon: 'http://developer.cdn.mozilla.net/media/redesign/img/favicon32.png',
      url: 'https://www.google.com/search?q=site:developer.mozilla.org/ja/docs %ARG%'
    },
    wikipedia: {
      url: 'http://ja.wikipedia.org/wiki/Special:Search?search=%ARG%'
    },
    twitter: {
      url: 'https://twitter.com/search?q=%ARG%&src=typd&f=realtime'
    },
    'twitter(lang:ja)': {
      url: 'https://twitter.com/search?q=%ARG% lang:ja&src=typd&f=realtime'
    },
    twilog: {
      description: 'Twilog - ebith',
      icon: 'http://twilog.org/favicon.png',
      url: 'http://twilog.org/ebith/search?word=%ARG%'
    },
    nicovideo: {
      description: 'ニコニコ動画',
      url: 'http://www.nicovideo.jp/search/%ARG%'
    }
  };

  commands.addUserCommand(['yaopen'], 'Yet another :tabopen', function(args) {
    var url;
    if (sites[args[0]]) {
      url = sites[args[0]].url.replace(/%ARG%/, encodeURIComponent(args[1]));
      return liberator.open(url, liberator.NEW_TAB);
    } else {
      return liberator.echoerr("yaopen: " + args[0] + " is undefined");
    }
  }, {
    literal: 1,
    completer: function(context, args) {
      var key, site;
      if (args.completeArg === 1) {
        return;
      }
      context.completions = (function() {
        var _ref, _ref1, _results;
        _results = [];
        for (key in sites) {
          site = sites[key];
          _results.push([key, (_ref = site.description) != null ? _ref : '', (_ref1 = site.icon) != null ? _ref1 : util.createURI(site.url).prePath + '/favicon.ico']);
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

}).call(this);
