// ==UserScript==
// @name steam country code changer
// @version 1.1
// @author ebith
// @include http://store.steampowered.com/*
// ==/UserScript==

(function(){
  var hostname = document.URL.split('?')[0];
  var ccs = [
    '<a class="submenuitem" href="' + hostname + '?cc=us">アメリカ</a>',
    // '<a class="submenuitem" href="' + hostname + '?cc=uk">イギリス</a>',
    // '<a class="submenuitem" href="' + hostname + '?cc=eu">ヨーロッパ</a>',
    '<a class="submenuitem" href="' + hostname + '?cc=jp">日本</a>',
  ]
  var ccChanger = document.createElement('a');
  ccChanger.textContent = 'カントリーコード'
  ccChanger.className = 'menuitem supernav';
  ccChanger.setAttribute('data-tooltip-content', ccs.join(''));

  document.getElementById('supernav').appendChild(ccChanger);
})();
