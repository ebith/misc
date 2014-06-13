
/*
// ==UserScript==
// @name nicovideo watch page fix
// @version 1.0
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// ==/UserScript==
ref: https://greasyfork.org/scripts/452-shinjukuwatch/code
 */

(function() {
  var $, controller;

  $ = unsafeWindow.jQuery;

  unsafeWindow.WatchApp.ns.model.player.NicoPlayerConnector.onTagDataReceived = function() {};

  unsafeWindow.WatchApp.ns.model.player.NicoPlayerConnector.getCommentNicoruCount = function() {
    return 0;
  };

  controller = unsafeWindow.WatchApp.ns.init.VideoExplorerInitializer.videoExplorerController;

  controller.showMylist = $.proxy(function(id) {
    return location.href = "/mylist/" + id;
  }, controller);

  controller.searchVideo = $.proxy(function(word, type) {
    return location.href = (type === 'tag' ? 'tag' : 'search') + ("/" + (encodeURIComponent(word)));
  }, controller);

}).call(this);
