###
// ==UserScript==
// @name google search hotkey
// @version 1.0
// @author ebith
// @include https://www.google.co.jp/search*
// @grant none
// @noframes
// ==/UserScript==
###

do main = ->
  Time = ['h', 'd', 'w', 'm', 'y', 'a']
  Lang = ['lang_ja', 'lang_en']

  qdr = /(=|,)qdr:(.)(,|&|$)/.exec(v)[2] for v in window.location.search.split '&' when /^tbs=/.test v
  lr = /^lr=(.*)$/.exec(v)[1] for v in window.location.search.split '&' when /^lr=/.test v

  document.addEventListener 'keydown', (e) ->
    if e.target.tagName is 'BODY'
      switch e.keyCode
        when 81  # q
          setLocation 'time', Time[Time.indexOf(qdr or 'a') - 1] or 'h'
        when 87  # w
          setLocation 'time', Time[Time.indexOf(qdr or 'a') + 1] or 'a'
        when 69  # e
          setLocation 'lang', if lr is Lang[0] then Lang[1] else Lang[0]

  setLocation = (mode, param) ->
    switch mode
      when 'time'
        if qdr
          window.location = window.location.href.replace /(=|,)qdr:.(,|&|$)/, "$1qdr:#{param}$2"
        else
          window.location = window.location.href + "&tbs=qdr:#{param}"
      when 'lang'
        if lr
          window.location = window.location.href.replace /(\?|&)lr=.*?(&|$)/, "$1lr=#{param}$2"
        else
          window.location = window.location.href + "&lr=#{param}"
