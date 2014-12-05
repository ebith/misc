###
// ==UserScript==
// @name       nantobank fix
// @version    1.1
// @author     ebith
// @include    https://www.inb.nantobank.chance.co.jp/*
// @grant none
// @noframes
// ==/UserScript==
###

pin = [
  [ '00', '00', '00', '00', '00' ]
  [ '00', '00', '00', '00', '00' ]
  [ '00', '00', '00', '00', '00' ]
  [ '00', '00', '00', '00', '00' ]
  [ '00', '00', '00', '00', '00' ]
]
table =
  'ア': 1
  'イ': 2
  'ウ': 3
  'エ': 4
  'オ': 5

target =
  CLIENTIDNUMBER: on
  PASSWORD: on
  PINNUMBER: off

# autocompleteをつけたりはずしたりする
for name, value of target
  document.getElementsByName(name)[0]?.setAttribute('autocomplete', value)

# 確認番号を自動入力する
if e = document.getElementsByName('PINNUMBER')?[0]
  e.setAttribute 'type', 'text'
  key = (do v.trim for v in e.parentElement.parentElement.previousElementSibling.lastElementChild.textContent.split('-'))
  e.value = pin[key[1]-1][table[key[0]]-1]
