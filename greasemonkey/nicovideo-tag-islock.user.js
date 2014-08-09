
/*
// ==UserScript==
// @name nicovideo add padlock to tags
// @version 1.3
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// @grant none
// @require https://gist.githubusercontent.com/arantius/3123124/raw/1866c6780e1946f657f688537b199e0102ccd19c/grant-none-shim.js
// ==/UserScript==
 */

(function() {
  var css, main, style;

  css = '#videoHeaderTagList > .locked:before { content: "🔒"; color: #b5a642;}';

  style = document.createElement('style');

  style.setAttribute('type', 'text/css');

  style.textContent = css;

  document.body.appendChild(style);

  (main = function() {
    if (!WatchApp.ns.init.PlayerInitializer.playerAreaConnector) {
      return setTimeout((function() {
        return main();
      }), 1000);
    } else {
      return WatchApp.ns.api.TagAPILoader.prototype.getTags(WatchJsApi.video.getVideoID(), function(status, data) {
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
    }
  })();

}).call(this);
