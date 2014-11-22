
/*
 * Refs:
 *   LDRをj、kで前後の記事、nで新しいタブで開くGreasemonkey - http://la.ma.la/blog/diary_200604261407.htm - https://gist.github.com/azu/491fa1c5050fc378c746
 *   ldrのレートを++/--できるようにするgreasemonkeyスクリプト - いぬビーム - http://d.hatena.ne.jp/kusigahama/20071107/1194447701
 *   feedeen.com for vimperator - https://gist.github.com/anekos/d0f80263bc3def842ddb
 */

(function() {
  var rate, subCommands;

  rate = function() {
    return content.document.getElementById('rate_img').src.replace(/^.*(\d)\.gif$/, '$1') - 0;
  };

  subCommands = [
    new Command('next', '', function(args) {
      return content.wrappedJSObject.Control.go_next();
    }), new Command('prev', '', function(args) {
      return content.wrappedJSObject.Control.go_prev();
    }), new Command('open', '', function(args) {
      if (typeof TreeStyleTabService !== "undefined" && TreeStyleTabService !== null) {
        TreeStyleTabService.readyToOpenChildTabNow(gBrowser.selectedTab);
      }
      return liberator.open(content.wrappedJSObject.get_active_item(true).link, liberator.NEW_BACKGROUND_TAB);
    }), new Command('readitlater', '', function(args) {
      var item;
      item = content.wrappedJSObject.get_active_item(true);
      return plugins.readitlater.API.add(item.link, item.title, function() {
        return liberator.echo("[readitlater] added: " + item.title + " - " + item.link);
      });
    }), new Command('incrementrate', '', function(args) {
      return content.wrappedJSObject.vi[rate() + 1]();
    }), new Command('decrementrate', '', function(args) {
      return content.wrappedJSObject.vi[rate() - 1]();
    })
  ];

  commands.addUserCommand(['ldr'], 'reader.livedoor.com', function(args) {}, {
    subCommands: subCommands,
    literal: 1
  }, true);

}).call(this);
