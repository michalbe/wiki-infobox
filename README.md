# WikiInfobox by [@michalbe](http://github.com/michalbe) #
Simple Wikipedia infobox scraper.

### What? ###
WikiInfobox is a simple Wikipedia infobox scraper. What is **infobox**? According to Wikipedia itself, _an infobox template is a panel, usually in the top right of an article, next to the lead section, (in the desktop view) or at the very top of an article (in mobile view), that summarizes key features of the page's subject. Infoboxes may also include an image, and/ or a map._

![Infobox](https://raw.githubusercontent.com/michalbe/wiki-infobox/master/static/infobox.jpg)

### Why? ###
* __Question:__ Why do we need WikiInfobox library? Wikipedia has it's own API!
* __Answer:__ Of course, but it answers only with full content of the current page, with all the Wiki-specific markdown code, without any formatting. It's really painful to get useful information out of this. Wiki-infobox parses Wikipedia API's response, and serve magnificent `JSON object`!


### How to use: ###
```
npm install wiki-infobox
```

then:
```javascript
var infobox = require('wiki-infobox');

var page = 'Warsaw Metro';
var language = 'en';

infobox(page, language, function(err, data){
  if (err) {
    // Oh no! Something goes wrong!
    return;
  }

  console.log(data);
  // {
  //   box_length: '275px',
  //   name:
  //     {
  //       type: 'text',
  //       value: 'Warsaw Metro<br>\'\'Metro Warszawskie\'\''
  //     },
  //   owner:
  //    {
  //      type: 'text',
  //      value: 'City of Warsaw'
  //    },
  //   locale:
  //    [ { type: 'link',
  //        text: 'Warsaw',
  //        url: 'http://en.wikipedia.org/wiki/Warsaw' },
  //      { type: 'link',
  //        text: 'Poland',
  //        url: 'http://en.wikipedia.org/wiki/Poland' } ],
  //   transit_type:
  //    { type: 'link',
  //      text: 'Rapid transit',
  //      url: 'http://en.wikipedia.org/wiki/Rapid transit' },
  //   lines: '1<ref name',
  //   stations: '21<ref name',
  //   ridership: '568,000 <small>(2012; ave. weekday)</small><ref name',
  //   annual_ridership: '139.17 million <small>(2012)</small><ref name',
  //   website: '{{url|www.metro.waw.pl|Metro Warszawskie}}',
  //   began_operation: '1995',
  //   operator: 'Metro Warszawskie',
  //   marks: '',
  //   vehicles: '',
  //   system_length: '{{convert|22.7|km|mi|1|abbr',
  //   track_gauge:
  //    { type: 'link',
  //      text: 'standard gauge',
  //      url: 'http://en.wikipedia.org/wiki/standard gauge' },
  //   map:
  //    { type: 'image',
  //      text: 'frameless',
  //      url: 'http://en.wikipedia.org/wiki/File:Metro w Warszawie 1 linia.svg' },
  //   map_name: '',
  //   map_state: '}}'
  // }
});
```

### What's new? ###

* 23 Nov 2014 __v.0.4.0__
  * Return error when page is not proper Wikipedia page with data
  * When wikipage we are asking for is a redirect page then return results from the final page
  * Support proper character encoding in the page title (so pages with special characters work without any problems now)

* 18 Nov 2014 __v.0.3.1__
  * Support of multiple types of data in the same field, like text & links & images, etc.
  * Simple text is now returned as an object with two fields, `type` equal to `text` and `value` equal to the value fo the text node

### To Do ###
Support of:
* external links (like `{{url|www.metro.waw.pl|Metro Warszawskie}}`)
* templates (like `{{flag|Poland}}`)
* comments
* somehow tidy HTML code inside fields
* expressions (like `{{ 3434 + 19817934 + 213123 }}`)
* a lot of different things


## Contributing ##
Interested in contributing to `wiki-infobox`? [Read this](CONTRIBUTING.md) first
