###
// ==UserScript==
// @name nicovideo watch page fix
// @version 1.1
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// @grant none
// ==/UserScript==
ref: https://greasyfork.org/scripts/452-shinjukuwatch/code
###

# タグを自動更新しない
WatchApp.ns.model.player.NicoPlayerConnector.onTagDataReceived = ->

# ニコる数を取得しない
WatchApp.ns.model.player.NicoPlayerConnector.getCommentNicoruCount = -> 0

# 普通にページ遷移する
do main = ->
  if not controller = WatchApp.ns.init.VideoExplorerInitializer.videoExplorerController
    setTimeout (-> do main), 1000
  else
    controller.showMylist = $.proxy (id) ->
      location.href = "/mylist/#{id}"
    , controller
    controller.searchVideo = $.proxy (word, type) ->
      location.href = (if type is 'tag' then 'tag' else 'search') + "/#{encodeURIComponent word}"
    , controller
