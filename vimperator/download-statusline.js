(function() {
  var e, onSummaryChanged, updateDownloadState;

  Cu["import"]('resource://gre/modules/Downloads.jsm');

  onSummaryChanged = function() {
    if (summary.allHaveStopped || summary.progressTotalBytes === 0) {
      return updateDownloadState(null);
    } else {
      this.downloads = 0;
      return list.getAll().then((function(_this) {
        return function(downloads) {
          var download, percent, progressCurrentBytes, _i, _len;
          for (_i = 0, _len = downloads.length; _i < _len; _i++) {
            download = downloads[_i];
            if (download.hasProgress && !download.stopped) {
              _this.downloads++;
            }
          }
          progressCurrentBytes = Math.min(summary.progressTotalBytes, summary.progressCurrentBytes);
          percent = Math.floor(progressCurrentBytes / summary.progressTotalBytes * 100);
          return updateDownloadState("\u2193" + percent + "% of " + _this.downloads);
        };
      })(this));
    }
  };

  Downloads.getSummary(Downloads.ALL).then(function(summary) {
    this.summary = summary;
    return summary.addView({
      onSummaryChanged: onSummaryChanged
    });
  });

  Downloads.getList(Downloads.ALL).then(function(list) {
    return this.list = list;
  });

  e = document.createElement('label');

  e.id = 'liberator-status-download';

  e.style.fontWeight = 'bold';

  document.getElementById('liberator-status').appendChild(e);

  statusline.addField('download', 'download progress', 'liberator-status-download', function(node, state) {
    return node.value = state != null ? state : '';
  });

  updateDownloadState = function(state) {
    return statusline.updateField('download', state);
  };

  options.status += ',download';

}).call(this);
