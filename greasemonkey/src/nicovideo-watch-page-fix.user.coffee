###
// ==UserScript==
// @name nicovideo watch page fix
// @version 1.0
// @author ebith
// @include http://www.nicovideo.jp/watch/*
// ==/UserScript==
ref: https://greasyfork.org/scripts/452-shinjukuwatch/code
###

$ = unsafeWindow.jQuery

# タグを自動更新しない
unsafeWindow.WatchApp.ns.model.player.NicoPlayerConnector.onTagDataReceived = ->

# ニコる数を取得しない
unsafeWindow.WatchApp.ns.model.player.NicoPlayerConnector.getCommentNicoruCount = -> 0

# 普通にページ遷移する
controller = unsafeWindow.WatchApp.ns.init.VideoExplorerInitializer.videoExplorerController
controller.showMylist = $.proxy (id) ->
  location.href = "/mylist/#{id}"
, controller
controller.searchVideo = $.proxy (word, type) ->
  location.href = (if type is 'tag' then 'tag' else 'search') + "/#{encodeURIComponent word}"
, controller
