# userChrome.js/downloadProgressInCaption_Fx26.uc.js at master · alice0775/userChrome.js - https://github.com/alice0775/userChrome.js/blob/master/downloadProgressInCaption_Fx26.uc.js
Cu.import 'resource://gre/modules/Downloads.jsm'

onSummaryChanged = ->
  if summary.allHaveStopped or summary.progressTotalBytes is 0
    updateDownloadState null
  else
    do countDownloads
    progressCurrentBytes = Math.min summary.progressTotalBytes, summary.progressCurrentBytes
    percent = Math.floor progressCurrentBytes / summary.progressTotalBytes * 100
    updateDownloadState "#{percent}% of #{downloads}"

Downloads.getSummary Downloads.ALL
  .then (summary) ->
    @summary = summary
    summary.addView {onSummaryChanged}

Downloads.getList Downloads.ALL
  .then (list) ->
    @list = list

countDownloads = ->
  @downloads = 0
  list.getAll().then (downloads) ->
    for download in downloads
      if download.hasProgress and not download.succeeded
        @downloads++

e = document.createElement 'label'
e.id = 'liberator-status-download'
e.style.fontWeight = 'bold'
document.getElementById 'liberator-status'
  .appendChild e

statusline.addField 'download', 'download progress', 'liberator-status-download', (node, state) ->
  node.value = state ? ''

updateDownloadState = (state) ->
  statusline.updateField 'download', state

options.status += ',download'
