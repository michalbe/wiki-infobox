var request = require('request');
var separator = require('simple-random-id')();

var getInfobox = function(page, language, cb) {
  var apiURL = 'http://'+ language + '.wikipedia.org/w/api.php?format' +
               '=json&action=query&prop=revisions&rvprop=content&titles=' +
               page;

  var wikiURL = 'http://' + language +'.wikipedia.org/wiki/';

  request.get(apiURL, function(error, data, body){
    if (error) {
      cb(error);
      return;
    }

    var content = JSON.parse(body);
    content = content.query.pages;

    var page = Object.keys(content);
    content = content[page].revisions[0]['*'];

    var startingPointRegex = /\{\{\s*[Ii]nfobox/;

    var macz = content.match(startingPointRegex).index;

    var end = parse(content.substr(macz, content.length));

    content = content.substr(macz+2, end);

    content = content.replace(/\n/g, ' ');
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

      // This catch is needed because sometimes Infobox ends with |}} what is
      // not right (think of it as of additional coma at the end of the array)
      // I know it's not the best way to fix it, but it's the fastest.
      try {

        output[splited[0]] = stringToObject(splited[0], splited[1].replace(new RegExp(separator, 'g'), '|'));

      } catch(error) {
        cb(error);
      }

    });

    cb(null, output);

  });

  var stringToObject = function(name, value) {
    //var match = link.match(/\[\[(.*)\]\]/);
    var matches = [];
    value.replace(/\[\[(.*?)\]\]/g, function(g0,g1){matches.push(g1);})
    if (matches.length > 0) {
      var results = [];
      var obj = {
        type: 'link'
      };
      matches.forEach(function(matchElement) {
        obj = {
          type: 'link'
        }

        if (matchElement.indexOf('File:') > -1 || matchElement.indexOf('Image:') > -1) {
          obj.type = 'image';
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

      if (results.length === 1) {
        results = results.pop();
      }
      return results;

    } else {
      return value;
    }
  }

  var parse = function(text) {
    var brackets = 0;

    for (var i=0, l=text.length; i<l; i++) {
      if (text.charAt(i) === '{') {
        brackets++;
      } else if (text.charAt(i) === '}') {
        brackets--;
      }

      if (brackets === 0 && i > 0) {
        return i-1;
      }
    }
  }
}

getInfobox('Warsaw', 'en', function(error, result){
  if (error) {
    console.log('Error');
    return;
  }

  console.log(result);
});
