liberator.plugins.ebith = {}
ebith = liberator.plugins.ebith

ebith.request = (options, callback) ->
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
