###
// ==UserScript==
// @name nicovideo add padlock to tags
// @version 1.3
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// @grant none
// @require https://gist.githubusercontent.com/arantius/3123124/raw/1866c6780e1946f657f688537b199e0102ccd19c/grant-none-shim.js
// ==/UserScript==
###

css = '#videoHeaderTagList > .locked:before { content: "🔒"; color: #b5a642;}'
style = document.createElement('style')
style.setAttribute 'type', 'text/css'
style.textContent = css
document.body.appendChild style

do main = ->
  if not WatchApp.ns.init.PlayerInitializer.playerAreaConnector
    setTimeout (-> do main), 1000
  else
    WatchApp.ns.api.TagAPILoader::getTags WatchJsApi.video.getVideoID(), (status, data) ->
      tagList = document.getElementById("videoHeaderTagList").getElementsByClassName("videoHeaderTag")
      data.tags.forEach (tag) ->
        if tag.owner_lock is 1
          Array.forEach tagList, (elem) ->
            elem.classList.add 'locked'  if elem.firstChild.textContent is tag.tag
