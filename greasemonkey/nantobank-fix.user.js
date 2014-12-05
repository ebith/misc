
/*
// ==UserScript==
// @name       nantobank fix
// @version    1.1
// @author     ebith
// @include    https://www.inb.nantobank.chance.co.jp/*
// @grant none
// @noframes
// ==/UserScript==
 */

(function() {
  var e, key, name, pin, table, target, v, value, _ref, _ref1;

  pin = [['00', '00', '00', '00', '00'], ['00', '00', '00', '00', '00'], ['00', '00', '00', '00', '00'], ['00', '00', '00', '00', '00'], ['00', '00', '00', '00', '00']];

  table = {
    'ア': 1,
    'イ': 2,
    'ウ': 3,
    'エ': 4,
    'オ': 5
  };

  target = {
    CLIENTIDNUMBER: true,
    PASSWORD: true,
    PINNUMBER: false
  };

  for (name in target) {
    value = target[name];
    if ((_ref = document.getElementsByName(name)[0]) != null) {
      _ref.setAttribute('autocomplete', value);
    }
  }

  if (e = (_ref1 = document.getElementsByName('PINNUMBER')) != null ? _ref1[0] : void 0) {
    e.setAttribute('type', 'text');
    key = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = e.parentElement.parentElement.previousElementSibling.lastElementChild.textContent.split('-');
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        v = _ref2[_i];
        _results.push(v.trim());
      }
      return _results;
    })();
    e.value = pin[key[1] - 1][table[key[0]] - 1];
  }

}).call(this);
