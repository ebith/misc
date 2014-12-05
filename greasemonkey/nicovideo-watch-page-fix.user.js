
/*
// ==UserScript==
// @name nicovideo watch page fix
// @version 1.2
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// @grant none
// @noframes
// ==/UserScript==
ref: https://greasyfork.org/scripts/452-shinjukuwatch/code
 */

(function() {
  var WIM, main, onReset;

  WIM = require('watchapp/model/WatchInfoModel').getInstance();

  if (WIM.initialized) {
    main();
  } else {
    onReset = function() {
      WIM.removeEventListener('reset', onReset);
      return setTimeout((function() {
        return main();
      }), 100);
    };
    WIM.addEventListener('reset', onReset);
  }

  (main = function() {
    var css, style;
    css = '#videoHeaderTagList > .locked:before { content: "🔒"; color: #b5a642;}';
    style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = css;
    document.body.appendChild(style);
    WatchApp.ns.api.TagAPILoader.prototype.getTags(WatchJsApi.video.getVideoID(), function(status, data) {
      var tagList;
      tagList = document.getElementById("videoHeaderTagList").getElementsByClassName("videoHeaderTag");
      return data.tags.forEach(function(tag) {
        if (tag.owner_lock === 1) {
          return Array.forEach(tagList, function(elem) {
            if (elem.firstChild.textContent === tag.tag) {
              return elem.classList.add('locked');
            }
          });
        }
      });
    });
    WatchApp.ns.model.player.NicoPlayerConnector.onTagDataReceived = function() {};
    WatchApp.ns.model.player.NicoPlayerConnector.getCommentNicoruCount = function() {
      return 0;
    };
    controller.showMylist = $.proxy(function(id) {
      return location.href = "/mylist/" + id;
    }, controller);
    return controller.searchVideo = $.proxy(function(word, type) {
      return location.href = (type === 'tag' ? 'tag' : 'search') + ("/" + (encodeURIComponent(word)));
    }, controller);
  })();

}).call(this);
