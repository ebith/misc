liberator.registerObserver 'enter', ->
  libly.$U.around liberator, 'log', ((next, [msg, flag]) ->
    path = liberator.globalVariables.log_writer_logfile_path ? '~/.vimperator.log'
    if (window.growlgntp) then growlgntp.growl.register 'Vimperator', 'http://vimperator.org/favicon.ico', [{name: 'QB', displayName: 'echo'}, {name: 'super-logger', displayName: 'log'}]
    if typeof msg == "object"
      msg = Cc["@mozilla.org/feed-unescapehtml;1"].getService(Ci.nsIScriptableUnescapeHTML).unescape(util.objectToString(msg, false).value)
    switch flag
      when 'write'
        (io.File path).write "#{msg}\n", '>>'
      when 'growl'
        growlgntp.growl.notify 'Vimperator', 'super-logger', 'log', msg, null
    services.get("console").logStringMessage(config.name.toLowerCase() + ": " + msg)
  ), true

