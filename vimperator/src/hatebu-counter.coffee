e = document.createElement 'label'
e.id = 'liberator-status-hbcount'
e.style.fontWeight = 'bold'
document.getElementById 'liberator-status'
  .appendChild e

statusline.addField 'hbcount', 'はてブ数', 'liberator-status-hbcount', (node) ->
  util.httpGet 'http://api.b.st-hatena.com/entry.count?url=' + encodeURIComponent(buffer.URL), (xhr) ->
    if xhr.status is 200
      node.value = xhr.responseText - 0
    else
      node.value = 0

autocommands.add 'LocationChange', /.*/, ->
  statusline.updateField 'hbcount'
