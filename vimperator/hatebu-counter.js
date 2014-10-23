(function() {
  var e;

  e = document.createElement('label');

  e.id = 'liberator-status-hbcount';

  e.style.fontWeight = 'bold';

  document.getElementById('liberator-status').appendChild(e);

  statusline.addField('hbcount', 'はてブ数', 'liberator-status-hbcount', function(node) {
    return util.httpGet('http://api.b.st-hatena.com/entry.count?url=' + encodeURIComponent(buffer.URL), function(xhr) {
      if (xhr.status === 200) {
        return node.value = xhr.responseText - 0;
      } else {
        return node.value = 0;
      }
    });
  });

  autocommands.add('LocationChange', /.*/, function() {
    return statusline.updateField('hbcount');
  });

}).call(this);
