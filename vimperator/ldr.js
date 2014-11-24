
/*
 * Refs:
 *   LDRをj、kで前後の記事、nで新しいタブで開くGreasemonkey - http://la.ma.la/blog/diary_200604261407.htm - https://gist.github.com/azu/491fa1c5050fc378c746
 *   ldrのレートを++/--できるようにするgreasemonkeyスクリプト - いぬビーム - http://d.hatena.ne.jp/kusigahama/20071107/1194447701
 *   feedeen.com for vimperator - https://gist.github.com/anekos/d0f80263bc3def842ddb
 */

(function() {
  var rate, subCommands, w;

  w = function() {
    return content.wrappedJSObject;
  };

  rate = function() {
    return content.document.getElementById('rate_img').src.replace(/^.*(\d)\.gif$/, '$1') - 0;
  };

  subCommands = [
    new Command('next', '', function(args) {
      return w().Control.go_next();
    }), new Command('prev', '', function(args) {
      return w().Control.go_prev();
    }), new Command('open', '', function(args) {
      if (typeof TreeStyleTabService !== "undefined" && TreeStyleTabService !== null) {
        TreeStyleTabService.readyToOpenChildTabNow(gBrowser.selectedTab);
      }
      liberator.open(w().get_active_item(true).link, liberator.NEW_BACKGROUND_TAB);
      return w().Control.go_next();
    }), new Command('readitlater', '', function(args) {
      var item;
      item = w().get_active_item(true);
      plugins.readitlater.API.add(item.link, item.title, function() {
        return liberator.echo("[readitlater] added: " + item.title + " - " + item.link);
      });
      return w().Control.go_next();
    }), new Command('incrementrate', '', function(args) {
      return w().vi[rate() + 1]();
    }), new Command('decrementrate', '', function(args) {
      return w().vi[rate() - 1]();
    })
  ];

  commands.addUserCommand(['ldr'], 'reader.livedoor.com', function(args) {}, {
    subCommands: subCommands,
    literal: 1
  }, true);

}).call(this);
