var gamejs = require('gamejs');

exports.play = function(type) {
   sounds[type].play();
}

exports.get = function(type) {
   return sounds[type];
}

var types = ['splash0', 'splash1', 'splash2', 'splash3', 'splash4',
   'cg1', 'pistol', 'shotgun'];
var sounds = [];
exports.getPreloadAssets = function() {
   return types.map(function(t) {
      return './sounds/' + t + '.wav';
   });
}

exports.init = function() {
   types.forEach(function(t) {
      sounds[t] = new gamejs.mixer.Sound('./sounds/' + t + '.wav');
   });
   return;
}