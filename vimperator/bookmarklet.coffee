map = {}
commands.addUserCommand(['bookmarklet', 'bml'], 'run bookmarklet', (args) ->
  liberator.open map[args]
,
  completer: (context, args) ->
    list = []
    for bookmarklet in bookmarks.get 'javascript:'
      map[bookmarklet.title] = bookmarklet.url
      list.push [bookmarklet.title, bookmarklet.url]
    context.completions = list
    context.compare = CompletionContext.Sort.unsorted
, true)
