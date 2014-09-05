AL =
  apps: {}
  dirs: ->
    if liberator.has 'MacUnix'
      return ['/Applications', '~/Applications']
    else if liberator.has 'Windows'
      return []
  filter: (app) ->
    if liberator.has 'MacUnix'
      return /\.app$/.test app.path
    else if liberator.has 'Windows'
      return apps
  init: ->
    Cu.import 'resource://gre/modules/FileUtils.jsm'
    do @appScan

    commands.addUserCommand(['applicationLauncher', 'al'], 'Application Launcher', (args) ->
      return
    ,
      subCommands: [
        new Command 'scan', 'scan application dirs', (args) =>
          do @appScan
        new Command 'run', 'run application', (args) =>
          do @apps[args]?.launch
        ,
          completer: (context, args) =>
            context.completions = ([app.leafName, app.path] for appName, app of @apps)
            context.compare = CompletionContext.Sort.unsorted
      ]
    , true)
  appScan: ->
    for dirPath in @dirs()
      dir = new FileUtils.File dirPath
      if dir.exists()
        entries = dir.directoryEntries
        while entries.hasMoreElements()
          app = entries.getNext().QueryInterface(Ci.nsIFile)
          if @filter app
            @apps[app.leafName] = app

do AL.init
