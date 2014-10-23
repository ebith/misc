sites = liberator.globalVariables.meisai or
  saison:
    description: 'SAISON CARD Netアンサー'
    icon: 'http://www.saisoncard.co.jp/favicon.ico'
    login:
      url: 'https://netanswerplus.saisoncard.co.jp/WebPc/USA0100BLC01.do'
      extra:
        'org.apache.struts.taglib.html.TOKEN': ->
          options =
            url : 'https://netanswerplus.saisoncard.co.jp/WebPc/welcomeSCR.do'
            responseText: 'document'
          request options, (res) ->
            res.response.getElementsByName('org.apache.struts.taglib.html.TOKEN')[0]
    meisai:
      url: 'https://netanswerplus.saisoncard.co.jp/WebPc/USC0101BLC01.do'
  idemitsu:
    description: '出光カード ウェブステーション'
    icon: 'http://www.idemitsucard.com/favicon.ico'
    login:
      url: 'https://ws.idemitsucard.com/PC-IM/USA0100BLC01.do'
      extra:
        'org.apache.struts.taglib.html.TOKEN': ->
          options =
            url : 'https://ws.idemitsucard.com/PC-IM/welcomeSCR.do'
            responseText: 'document'
          request options, (res) ->
            res.response.getElementsByName('org.apache.struts.taglib.html.TOKEN')[0]
    meisai:
      url: 'https://ws.idemitsucard.com/PC-IM/USC0101BLC01.do'

commands.addUserCommand ['meisai'], '', (args) ->
  if site = sites[args[0]]
    uri = util.newURI site.login.url
    login = Cc['@mozilla.org/login-manager;1'].getService(Ci.nsILoginManager).findLogins({}, uri.prePath, '', null)[0]
    options =
      method: 'POST'
      url: uri.spec
      body: site.login.extra or {}
    options.body[login.usernameField] = login.username
    options.body[login.passwordField] = login.password
    request options, (res) ->
      liberator.open site.meisai.url, liberator.NEW_TAB
  else
    liberator.echoerr "meisai: #{args[0]} is undefined"
,
  completer: (context, args) ->
    return if args.completeArg > 0
    context.completions = ([key, site.description ? '', site.icon ? util.createURI(site.login.url).prePath + '/favicon.ico'] for key, site of sites)
    context.keys = text: 0, description: 1, icon: (item) -> item[2] or DEFAULT_FAVICON
    context.compare = CompletionContext.Sort.unsorted
, true

request = (options, callback) ->
  xhr = new XMLHttpRequest()
  xhr.open options.method ? 'GET', options.url
  if options.method is 'POST'
    xhr.setRequestHeader 'Content-Type', 'application/x-www-form-urlencoded'
  for key, value of options.headers
    xhr.setRequestHeader key, value
  xhr.responseType = options.responseType or 'text'
  xhr.onreadystatechange = ->
    if xhr.readyState is 4
      callback xhr
  body = for key, value of options.body
    "#{encodeURIComponent(key)}=#{encodeURIComponent(value)}"
  if options.overrideMimeType
    xhr.overrideMimeType options.overrideMimeType
  xhr.send if options.body then body.join('&') else null
