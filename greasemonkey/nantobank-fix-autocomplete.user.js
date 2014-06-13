// ==UserScript==
// @name       fix nantobank autocomplete
// @version    1.0
// @author     ebith
// @include    https://www.inb.nantobank.chance.co.jp/*
// ==/UserScript==

(function(){
  var names = ['CLIENTIDNUMBER', 'PASSWORD', 'PINNUMBER'];

  var elems = [];
  for(var i = 0; i < names.length; i++){
    elems.push(document.getElementsByName(names[i])[0]);
  }

  if (elems[0]){
    setAutocomplete([elems[0], elems[1]], true);
  } else if(elems[2]){
    setAutocomplete([elems[2]], false);
  }

  function setAutocomplete(elems, on){
    for(var i = 0; i < elems.length; i++){
      elems[i].setAttribute('autocomplete', on ? 'on' : 'off');
    }
  }

})();