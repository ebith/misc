
/*
// ==UserScript==
// @name nicovideo watch page fix
// @version 1.1
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// @grant none
// ==/UserScript==
ref: https://greasyfork.org/scripts/452-shinjukuwatch/code
 */

(function() {
  var main;

  WatchApp.ns.model.player.NicoPlayerConnector.onTagDataReceived = function() {};

  WatchApp.ns.model.player.NicoPlayerConnector.getCommentNicoruCount = function() {
    return 0;
  };

  (main = function() {
    var controller;
    if (!(controller = WatchApp.ns.init.VideoExplorerInitializer.videoExplorerController)) {
      return setTimeout((function() {
        return main();
      }), 1000);
    } else {
      controller.showMylist = $.proxy(function(id) {
        return location.href = "/mylist/" + id;
      }, controller);
      return controller.searchVideo = $.proxy(function(word, type) {
        return location.href = (type === 'tag' ? 'tag' : 'search') + ("/" + (encodeURIComponent(word)));
      }, controller);
    }
  })();

}).call(this);
