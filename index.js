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

    // Create a JSON object from the response
    var content = JSON.parse(body);

    // The API answers with quite complex JSON structure, similar to this:
    // {
    //   "query" : {
    //     "pages" : {
    //       "32908": {
    //         "revisions": [
    //           "*": CONTENT OF THE PAGE
    // ]}}}}
    //
    // So that is how we will get the content
    content = content.query.pages;
    var page = Object.keys(content);
    content = content[page].revisions[0]['*'];

    // Let's find the beginning of our infobox, it will start with two
    // mustache brackets (I don't know proper english workd for this),
    // unlimited number of spaces and 'infobox' label (can also start with
    // uppercase char).
    var startingPointRegex = /\{\{\s*[Ii]nfobox/;

    // What is the position of the string we are looking for
    // in the whole document?
    var start = content.match(startingPointRegex).index;
    // And how big is the block. Since we cannot simply match brackets in
    // JS using RegExp, I wrote small `parse` function that iterates throught
    // the document and counts opened and closed brackets. Dumm as hell but
    // works and performance is really good
    var end = parse(content.substr(start, content.length));

    // And we truncate the string exactly where we need
    content = content.substr(start+2, end);

    // This part is very stupid, but I had no time to figure out something
    // smarter.
    // Remove all the new lines, data in the infobox is separated with '|'
    // anyway, so it doesn't change anything.
    content = content.replace(/\n/g, ' ');

    // Now, find all the links ([[IMMA LINK]]) and templates ({{LIKE ME}})
    var result = content.match(/\[\[(.+?)\]\]|\{\{(.+?)\}\}/ig);

    // Iterate thru all of them
    result.forEach(function(link) {
      // And replace each '|' for our custom, random separator string
      content = content.replace(link, link.replace(/\|/g, separator));
    });

    // Because of the stupid thing we did before, we are sure that all the '|'
    // chars (what's the english name for this again?) are separators between
    // fields of the infobox, not special characters in links or templates.
    content = content.split('|');

    // Throw out the first element (it's something like '{{ Infobox', so has
    // no value for us)
    content.shift();

    var output = {};
    // Iterate thru all the fields of the infobox
    content.forEach(function(element) {
      // Every field is a key=value pair, separated by equal sign.
      var splited = element.split('=');
      // Some of them have a lot of white characters what makes no sense at all,
      // so let's trim them.
      splited = splited.map(function(el) {
        return el.trim();
      });

      // This trycatch is needed because sometimes Infobox ends with |}} what is
      // not right (think of it as of additional coma at the end of the array)
      // I know it's not the best way to fix it, but it's the fastest.
      try {
        // Replace previously changed '|' chars again and parse final string
        output[splited[0]] = stringToObject(
          splited[0], // I put this in here because maybe in the future we will
                      // want to determine way of parsing the string based on
                      // type, etc. 'image' field is sometimes just and url,
                      // not a proper wikipedia image ([[File:file_patch.jpg]])
          splited[1].replace(new RegExp(separator, 'g'), '|')
        );

      } catch(error) {
        cb(error);
      }

    });

    // return the output to callback
    cb(null, output);

  });

  var stringToObject = function(name, value) {
    // We can find a lot of objects in one infobox field, so let's grab all of
    // them using simple trick with .replace() callback
    var matches = [];
    value.replace(/\[\[(.*?)\]\]/g, function(g0,g1){matches.push(g1);});
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

getInfobox('Warsaw', 'en', function(error, result) {
  if (error) {
    console.log('Error');
    return;
  }

  console.log(result);
});
