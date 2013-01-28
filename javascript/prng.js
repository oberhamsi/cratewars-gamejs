var Alea = require('gamejs/utils/prng').Alea;

var alea = null;

var random = exports.random = function() {
   return alea.random();
}

exports.rand = function(min, max) {
   return min + (random() * (max-min));
}

var init = exports.init = function(seed) {
   alea = new Alea(seed || Date.now());
}

init();