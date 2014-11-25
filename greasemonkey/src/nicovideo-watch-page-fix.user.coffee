###
// ==UserScript==
// @name nicovideo watch page fix
// @version 1.2
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// @grant none
// ==/UserScript==
ref: https://greasyfork.org/scripts/452-shinjukuwatch/code
###

WIM = do require('watchapp/model/WatchInfoModel').getInstance
if WIM.initialized
  do main
else
  onReset = ->
    WIM.removeEventListener 'reset', onReset
    setTimeout (-> do main), 100
  WIM.addEventListener 'reset', onReset

do main = ->
  # タグロックを可視化する
  css = '#videoHeaderTagList > .locked:before { content: "🔒"; color: #b5a642;}'
  style = document.createElement 'style'
  style.setAttribute 'type', 'text/css'
  style.textContent = css
  document.body.appendChild style

  WatchApp.ns.api.TagAPILoader::getTags WatchJsApi.video.getVideoID(), (status, data) ->
    tagList = document.getElementById("videoHeaderTagList").getElementsByClassName("videoHeaderTag")
    data.tags.forEach (tag) ->
      if tag.owner_lock is 1
        Array.forEach tagList, (elem) ->
          elem.classList.add 'locked'  if elem.firstChild.textContent is tag.tag

  # タグを自動更新しない
  WatchApp.ns.model.player.NicoPlayerConnector.onTagDataReceived = ->

  # ニコる数を取得しない
  WatchApp.ns.model.player.NicoPlayerConnector.getCommentNicoruCount = -> 0

  # 普通にページ遷移する
  controller.showMylist = $.proxy (id) ->
    location.href = "/mylist/#{id}"
  , controller
  controller.searchVideo = $.proxy (word, type) ->
    location.href = (if type is 'tag' then 'tag' else 'search') + "/#{encodeURIComponent word}"
  , controller
