subCommands = [
  new Command 'f[ilters]', 'フィルタ設定を開く', (args) ->
    do document.getElementById('abp-command-filters').doCommand
  new Command 'b[lockableItems]', 'ブロック可能項目一覧を開閉する', (args) ->
    do document.getElementById('abp-command-sidebar').doCommand
  new Command 'e[nable]', '有効・無効を切り替える', (args) ->
    do document.getElementById('abp-command-enable').doCommand
    do BrowserReload if args.bang
]

commands.addUserCommand ['abp'], 'Adblock Plusを操作する', (args) ->
  return
,
  subCommands: subCommands
  literal: 1
, true
