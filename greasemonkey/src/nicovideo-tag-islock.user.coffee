###
// ==UserScript==
// @name nicovideo add padlock to tags
// @version 1.2
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// ==/UserScript==
###

GM_addStyle "#videoHeaderTagList .locked:before { content: \"🔒\"; color: #b5a642;}"

unsafeWindow.WatchApp.ns.init.PlayerInitializer.playerAreaConnector.addEventListener 'onVideoChangeStatusUpdated', ->
  do update

do update = ->
  unsafeWindow.WatchApp.ns.api.TagAPILoader::getTags unsafeWindow.WatchJsApi.video.getVideoID(), (status, data) ->
    tagList = document.getElementById("videoHeaderTagList").getElementsByClassName("videoHeaderTag")
    data.tags.forEach (tag) ->
      if tag.owner_lock is 1
        Array.forEach tagList, (elem) ->
          elem.classList.add 'locked'  if elem.firstChild.textContent is tag.tag
