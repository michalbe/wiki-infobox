var request = require('request');
var parse = require('./parseWikiText');
var separator = "0000000000";

var page = "Warsaw";
var apiURL = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=" + page;

request.get(apiURL, function(error, data, body){
  if (error) {
    console.log('ERROR: ', error);
    return;
  }

  var content = JSON.parse(body);
  content = content.query.pages;

  var page = Object.keys(content);
  content = content[page].revisions[0]['*'];

  var startingPointRegex = /\{\{\s*[Ii]nfobox/;

  var macz = content.match(startingPointRegex).index;

  var end = parse(content.substr(macz, content.length));

  content = content.substr(macz, end);

  var result = content.match(/\[\[(.+?)\]\]|\{\{(.+?)\}\}/ig);

  result.forEach(function(link) {
    content = content.replace(link, link.replace(/\|/g, separator));
  });

  content = content.split('|');
  content.shift();

  var output = {};
  content.forEach(function(element) {
    var splited = element.split('=');
    splited = splited.map(function(el) {
      return el.trim();
    });

    console.log(splited[1]);
    splited[1] = splited[1].replace(new RegExp(separator, 'g'), '|');
    console.log(splited[1]);

    output[splited[0]] = splited[1].replace(new RegExp(separator, 'g'), '|');
  });

  //console.log(output);
//console.log(content);
  //console.log(content.substr(macz, content.length);

});
