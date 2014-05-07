var parse = function(text) {
  var brackets = 0;

  for (var i=0, l=text.length; i<l; i++) {
    if (text.charAt(i) === '{') {
      brackets++;
    } else if (text.charAt(i) === '}') {
      brackets--;
    }

    if (brackets === 0 && i > 0) {
      console.log('block ended after ', i, ' characters');
      return i-1;
    }
  }
}

module.exports = parse;
