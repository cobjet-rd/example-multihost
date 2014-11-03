var http = require('http');
var express = require('express');
var group = process.env.CODIUS_GROUP.split(',');

var hostId = group.indexOf(process.env.CODIUS_SELF) + 1;

if (hostId === 1) {
  console.log('I\'m host number one!');

  http.get({
    host: group[1].split(':')[0],
    port: group[1].split(':')[1],
    path: '/'
  }, function(res) {
    process.stdout.write('Number two said: ');
    res.pipe(process.stdout);
    res.on('end', function () {
      process.exit(0);
    });
  });
} else if (hostId === 2) {
  console.log('I\'m host number two!');
  var app = express();

  app.get('/', function(req, res) {
    console.log('got request');
    res.set('Content-Type', 'text/plain');
    res.send("Hello from number two!\n").end();
    // TODO: Why is this timeout necessary? (It shouldn't be.)
    setTimeout(function () {
      process.exit(0);
    }, 50);
  });

  app.listen(process.env.PORT);
}
