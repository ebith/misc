
/*
// ==UserScript==
// @name nicovideo add padlock to tags
// @version 1.2
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// ==/UserScript==
 */

(function() {
  var update;

  GM_addStyle("#videoHeaderTagList .locked:before { content: \"🔒\"; color: #b5a642;}");

  unsafeWindow.WatchApp.ns.init.PlayerInitializer.playerAreaConnector.addEventListener('onVideoChangeStatusUpdated', function() {
    return update();
  });

  (update = function() {
    return unsafeWindow.WatchApp.ns.api.TagAPILoader.prototype.getTags(unsafeWindow.WatchJsApi.video.getVideoID(), function(status, data) {
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
  })();

}).call(this);
