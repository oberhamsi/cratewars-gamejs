/**
 * @fileoverview
 *
 */
var gamejs = require('gamejs');
var Director = require('./director').Director;
var scenes = require('./scenes');

gamejs.preload(require('./sounds').getPreloadAssets().concat([
   './images/crosshair.png',
   './images/crate.png',
   './images/cover.png',
   './images/sun.png'
]))
function main() {
   var display = gamejs.display.setMode([300,200], gamejs.display.DISABLE_SMOOTHING | gamejs.display.POINTERLOCK);

   var startGame = function() {
      gamejs.event.get();
      var director = new Director([1500, 900])
      director.start(new scenes.Game())
      document.getElementById('gjs-fullscreen-toggle').innerHTML = "Resume"
      document.getElementById('gjs-fullscreen-toggle').removeEventListener('click', startGame, false);
   }
   document.getElementById('gjs-fullscreen-toggle').disabled = false;
   document.getElementById('gjs-fullscreen-toggle').addEventListener('click', startGame, false);
};

gamejs.ready(main);
