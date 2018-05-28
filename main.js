const json = $.getJSON('db.json');

const test = $('#test');

test.html(json);