
/*
// ==UserScript==
// @name google search hotkey
// @version 1.0
// @author ebith
// @include https://www.google.co.jp/search*
// @grant none
// ==/UserScript==
 */

(function() {
  var main;

  (main = function() {
    var Lang, Time, lr, qdr, setLocation, v, _i, _j, _len, _len1, _ref, _ref1;
    Time = ['h', 'd', 'w', 'm', 'y', 'a'];
    Lang = ['lang_en', 'lang_ja'];
    _ref = window.location.search.split('&');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      if (/^tbs=/.test(v)) {
        qdr = /(=|,)qdr:(.)(,|&|$)/.exec(v)[2];
      }
    }
    _ref1 = window.location.search.split('&');
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      v = _ref1[_j];
      if (/^lr=/.test(v)) {
        lr = /^lr=(.*)$/.exec(v)[1];
      }
    }
    document.addEventListener('keydown', function(e) {
      if (e.target.tagName === 'BODY') {
        switch (e.keyCode) {
          case 81:
            return setLocation('time', Time[Time.indexOf(qdr || 'a') - 1] || 'h');
          case 87:
            return setLocation('time', Time[Time.indexOf(qdr || 'a') + 1] || 'a');
          case 69:
            return setLocation('lang', lr === Lang[0] ? Lang[1] : Lang[0]);
        }
      }
    });
    return setLocation = function(mode, param) {
      switch (mode) {
        case 'time':
          if (qdr) {
            return window.location = window.location.href.replace(/(=|,)qdr:.(,|&|$)/, "$1qdr:" + param + "$2");
          } else {
            return window.location = window.location.href + ("&tbs=qdr:" + param);
          }
          break;
        case 'lang':
          if (lr) {
            return window.location = window.location.href.replace(/(\?|&)lr=.*?(&|$)/, "$1lr=" + param + "$2");
          } else {
            return window.location = window.location.href + ("&lr=" + param);
          }
      }
    };
  })();

}).call(this);
