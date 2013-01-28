var gamejs = require('gamejs');

/**
 * Director
 */
exports.Director = function (dimensions) {
   var onAir = false;
   var activeScene = null;


   function handle (events) {
      events.forEach(function(ev) {
         if (ev.isFullscreen == false) {
            onAir = false;
            gamejs.display.setMode([200,200]);
         } else {
            onAir = true;
            display = gamejs.display.setMode(dimensions);
         }
      });
   }
   function tick(msDuration) {

      handle(gamejs.event.get(gamejs.event.DISPLAY));
      if (!onAir) return;

      if (typeof activeScene.update === 'function') {
         activeScene.update(msDuration);
      } else {
         // @@ danger: clear events if no update() on scene
         gamejs.event.get();
      }
      if (typeof activeScene.draw === 'function') {
         activeScene.draw(display);
      }
   };

   this.start = function(scene) {
      onAir = true;
      replaceScene(scene);
   };

   var replaceScene = function(scene) {
      activeScene = scene;
      gamejs.display.setCaption(scene.caption || 'Unnamed Scene')
   };

   this.getScene = function() {
      return activeScene;
   };

   var display = gamejs.display.setMode(dimensions, gamejs.display.DISABLE_SMOOTHING | gamejs.display.POINTERLOCK);
   gamejs.time.interval(tick);
   return this;
};
