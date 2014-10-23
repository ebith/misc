apiKey = liberator.globalVariables.steam_api or 'E912B5192623C96289A8EA2322E501DB'
countryCode = liberator.globalVariables.countryCode or 'JP'
if not liberator.globalVariables.steam_id
  return liberator.echoerr 'steam: need steam id'
else steamId = liberator.globalVariables.steam_id

setup = ->
  options =
    responseType: 'json'
    url: "https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=#{apiKey}&steamid=#{steamId}&format=json&include_appinfo=1"
  request options, (res) ->
    if res.status is 200
      @games = res.response.response.games

ownedGamesCompleter = (context, args) ->
  context.title = ['Title', 'Total playtime']
  context.keys = text: 'appid', description: 'playtime', icon: 'icon'
  context.process = [(item, text) ->
    new TemplateXML "<span highlight=\"CompIcon\"><img src=\"#{item.icon}\"/></span><span class=\"td-strut\"/>#{util.escapeHTML(item.item.name)}"
  ]
  context.filters = [(item) -> @match item.item.name]
  context.completions = do ->
    list = ({
      appid: game.appid
      name: game.name
      playtime: (game.playtime_forever / 60).toFixed(1)
      icon: "http://media.steampowered.com/steamcommunity/public/images/apps/#{game.appid}/#{game.img_icon_url}.jpg"
    } for game in games)
    switch args['-sort']
      when 'playtime'
        list.sort (a, b) ->
          a.playtime - b.playtime
      when 'playtime!'
        list.sort (a, b) ->
          b.playtime - a.playtime
      when 'title!'
        list.sort (a, b) ->
          b.name.localeCompare a.name
      else
        list.sort (a, b) ->
          a.name.localeCompare b.name
    return list
  context.compare = CompletionContext.Sort.unsorted

subCommands = [
  new Command 'o[pen]', 'open store page', (args) ->
    liberator.open "http://store.steampowered.com/app/#{args}/", liberator.NEW_TAB
  ,
    literal: 0
    options: [
      [['-sort', '-s'], commands.OPTION_STRING, null, [['title', ''], ['title!', ''], ['playtime', ''], ['playtime!', '']]]
    ]
    completer: ownedGamesCompleter
  new Command 's[earch]', 'search and open store page', (args) ->
    if /\d+/.test args
      liberator.open "http://store.steampowered.com/app/#{args}/", liberator.NEW_TAB
    else
      liberator.open "http://store.steampowered.com/search/?cc=#{countryCode}&category1=998&sort_order=ASC&term=#{args}", liberator.NEW_TAB
  ,
    literal: 0
    completer: (context, args) ->
      context.title = ['Title', 'Price, Metascore, Released']
      context.keys = text: 'appid'
      context.compare = CompletionContext.Sort.unsorted
      context.process = [
        (item, text) -> new TemplateXML "<span highlight=\"CompIcon\"></span><span class=\"td-strut\"/>#{util.escapeHTML(item.item.name)}",
        (item, text) -> new TemplateXML "<span style=\"display: inline-block; width: 7em;\">#{util.escapeHTML(item.item.price)}</span><span style=\"display: inline-block; width: 3em;\">#{if item.item.metascore then util.escapeHTML(item.item.metascore) else '-'}</span>#{util.escapeHTML(item.item.released)}",
      ]
      context.filters = []
      if args.literalArg.length > 2
        context.incomplete = true
        options =
          responseType: 'document'
          url: "http://store.steampowered.com/search/results?cc=#{countryCode}&category1=998&sort_order=ASC&term=#{args}"
        request options, (res) ->
          context.incomplete = false
          if res.status is 200 and res.response.getElementById('search_header')
            context.completions = ({
              appid: elem.href.match(/app\/(\d+)\//)[1]
              name: elem.getElementsByClassName('search_name')[0].getElementsByTagName('h4')[0].textContent
              price: elem.getElementsByClassName('search_price')[0].lastChild.textContent
              metascore: elem.getElementsByClassName('search_metascore')[0].textContent
              released: elem.getElementsByClassName('search_released')[0].textContent
            } for elem in res.response.getElementById('search_header').nextElementSibling.children when elem.tagName is 'A')

  new Command 'p[lay]', 'play game', (args) ->
    liberator.open "steam://run/#{args}"
  ,
    literal: 0
    options: [
      [['-sort', '-s'], commands.OPTION_STRING, null, [['title', ''], ['title!', ''], ['playtime', ''], ['playtime!', '']]]
    ]
    completer: ownedGamesCompleter
]

commands.addUserCommand ['steam'], 'steam', (args) ->
  liberator.open 'steam://'
,
  subCommands: subCommands
, true

# util {{{
request = (options, callback) ->
  xhr = new XMLHttpRequest()
  xhr.open options.method ? 'GET', options.url
  if options.method is 'POST'
    xhr.setRequestHeader 'Content-Type', 'application/x-www-form-urlencoded'
  for key, value of options.headers
    xhr.setRequestHeader key, value
  xhr.responseType = options.responseType ? 'text'
  xhr.onreadystatechange = ->
    if xhr.readyState is 4
      callback xhr
  body = for key, value of options.body
    "#{encodeURIComponent(key)}=#{encodeURIComponent(value)}"
  xhr.send if options.body then body.join('&') else null
# }}}

do setup
