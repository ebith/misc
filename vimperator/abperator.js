(function() {
  var subCommands;

  subCommands = [
    new Command('f[ilters]', 'フィルタ設定を開く', function(args) {
      return document.getElementById('abp-command-filters').doCommand();
    }), new Command('b[lockableItems]', 'ブロック可能項目一覧を開閉する', function(args) {
      return document.getElementById('abp-command-sidebar').doCommand();
    }), new Command('e[nable]', '有効・無効を切り替える', function(args) {
      document.getElementById('abp-command-enable').doCommand();
      if (args.bang) {
        return BrowserReload();
      }
    })
  ];

  commands.addUserCommand(['abp'], 'Adblock Plusを操作する', function(args) {}, {
    subCommands: subCommands,
    literal: 1
  }, true);

}).call(this);
