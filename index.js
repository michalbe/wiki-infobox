var request = require('request');
var parse = require('./parseWikiText');
var separator = Math.random().toString(36).slice(2).toUpperCase();

var page = "Breaking_Bad";
var apiURL = "http://en.wikipedia.org/w/api.php?format=json&action=query&prop=revisions&rvprop=content&titles=" + page;
var wikiURL = "http://en.wikipedia.org/wiki/";

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

    output[splited[0]] = linkToObject(splited[1].replace(new RegExp(separator, 'g'), '|'));
  });


  console.log(output.num_episodes);
  //console.log(output);
//console.log(content);
  //console.log(content.substr(macz, content.length);

});

var linkToObject = function(link) {
  //var match = link.match(/\[\[(.*)\]\]/);
  var matches = [];
  link.replace(/\[\[(.*?)\]\]/g, function(g0,g1){matches.push(g1);})
  if (matches.length > 0) {
    var results = [];
    var obj = {
      type: "link"
    };
    matches.forEach(function(matchElement) {
      obj = {
        type: "link"
      }
      matchElement = matchElement.split('|');
      if (matchElement.length > 1) {
        obj.text = matchElement[1];
        obj.url = wikiURL + matchElement[0];
      } else {
        obj.text = matchElement[0];
        obj.url = wikiURL + matchElement[0];
      }
      results.push(obj);
    });
    return results;

  } else {
    return link;
  }
}
