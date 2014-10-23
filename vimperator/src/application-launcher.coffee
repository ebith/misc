AL =
  apps: {}
  dirs: ->
    if liberator.has 'MacUnix'
      return ['/Applications', '~/Applications']
    else if liberator.has 'Windows'
      roots = [FileUtils.getFile('Progs', []).parent.path, FileUtils.getFile('CmPrgs', []).parent.path]
      dirs = []
      for dirPath in roots
        dirs.push dirPath
        do enumDir = (dirPath) ->
          dir = new FileUtils.File dirPath
          if not dir.isSpecial()
            entries = dir.directoryEntries
            while entries.hasMoreElements()
              entry = entries.getNext().QueryInterface(Ci.nsIFile)
              if entry.isDirectory()
                dirs.push entry.path
                enumDir entry.path
      return dirs
  filter: (app) ->
    if liberator.has 'MacUnix'
      return /\.app$/.test app.path
    else if liberator.has 'Windows'
      return /\.(exe|lnk)$/.test app.path
  init: ->
    Cu.import 'resource://gre/modules/FileUtils.jsm'
    do @appScan

    commands.addUserCommand(['applicationLauncher', 'al'], 'Application Launcher', (args) ->
      return
    ,
      subCommands: [
        new Command 'scan', 'scan application dirs', (args) =>
          do @appScan
        new Command 'launch', 'launch application', (args) =>
          do @apps[args]?.launch
        ,
          completer: (context, args) =>
            context.completions = ([app.leafName, app.path] for key, app of @apps)
            context.compare = CompletionContext.Sort.unsorted
      ]
    , true)
  appScan: ->
    for dirPath in @dirs()
      dir = new FileUtils.File dirPath
      if dir.exists() and not dir.isSpecial()
        entries = dir.directoryEntries
        while entries.hasMoreElements()
          app = entries.getNext().QueryInterface(Ci.nsIFile)
          if @filter app
            @apps[app.leafName] = app
do AL.init
