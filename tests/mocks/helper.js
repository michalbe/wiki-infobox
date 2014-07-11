'use strict';

module.exports = function(mock) {
  return '{"query":{"pages":{"32908":{"revisions":[{"*":"' +
         mock +
         '"}]}}}}\n';
};
