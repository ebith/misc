sites = liberator.globalVariables.yaopen or
  wolframAlpha:
    icon: 'http://www.wolframcdn.com/images/alpha.fav.png'
    url: 'http://www.wolframalpha.com/input/?i=%ARG%'
  '2ch':
    url: 'http://find2ch.net/search?q=%ARG%'
  tiqav:
    icon: 'http://tiqav.com/images/favicon.ico'
    url: 'http://tiqav.com/search/%ARG%'
  isthereanydeal:
    icon: 'http://s3-eu-west-1.amazonaws.com/itad/images/favicon.png'
    url: 'http://isthereanydeal.com/#/search:%ARG%;/scroll:#gamelist'
  devdocs:
    description: 'API Document Browser'
    url: 'http://devdocs.io/#q=%ARG%'
  mdn:
    description: 'Mozilla Developer Network'
    icon: 'http://developer.cdn.mozilla.net/media/redesign/img/favicon32.png'
    url: 'https://www.google.com/search?q=site:developer.mozilla.org/ja/docs %ARG%'
  wikipedia:
    url: 'http://ja.wikipedia.org/wiki/Special:Search?search=%ARG%'
  twitter:
    url: 'https://twitter.com/search?q=%ARG%&src=typd&f=realtime'
  'twitter(lang:ja)':
    url: 'https://twitter.com/search?q=%ARG% lang:ja&src=typd&f=realtime'
  twilog:
    description: 'Twilog - ebith'
    icon: 'http://twilog.org/favicon.png'
    url: 'http://twilog.org/ebith/search?word=%ARG%'
  nicovideo:
    description: 'ニコニコ動画'
    url: 'http://www.nicovideo.jp/search/%ARG%'

commands.addUserCommand ['yaopen'], 'Yet another :tabopen', (args) ->
  if sites[args[0]]
    url = sites[args[0]].url.replace /%ARG%/, encodeURIComponent args[1]
    liberator.open url, liberator.NEW_TAB
  else
    liberator.echoerr "yaopen: #{args[0]} is undefined"
,
  literal: 1
  completer: (context, args) ->
    return if args.completeArg is 1
    context.completions = ([key, site.description ? '', site.icon ? util.createURI(site.url).prePath + '/favicon.ico'] for key, site of sites)
    context.keys = text: 0, description: 1, icon: (item) -> item[2] or DEFAULT_FAVICON
    context.compare = CompletionContext.Sort.unsorted
, true
