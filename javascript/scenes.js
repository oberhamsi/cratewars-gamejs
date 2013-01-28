var gamejs = require('gamejs');
var Crosshair = require('./crosshair').Crosshair;
var Weapon = require('./weapon').Weapon;
var sprites = require('./sprites');
var Explosion = require('./explosion').Explosion;
var $v = require('gamejs/utils/vectors');
var sounds = require('./sounds');

var Perspective = function() {
   var origPosition = [1000, 300];
   var sway = 80;
   var swayDirection = 1;
   var playerPosition = origPosition.slice(0);
   var ds = gamejs.display.getSurface().getSize();
   var fov = 80;
   var ez = 1 / Math.tan(fov / 2)
   var sx = 1/2;
   var sy = 1/2;

   var to2d = this.to2d = function(pos3d) {
      var px = pos3d[0];
      var py = pos3d[1];
      var pz = pos3d[2];
      return [
         ds[0] - sx * ((px - playerPosition[0]) / (ez/pz)),
         ds[1] - sy * ((py - playerPosition[1]) / (ez/pz))
      ]
   }

   var isDown = {};
   this.handle = function(keyEvents) {
      keyEvents.forEach(function(event) {
         if (event.type === gamejs.event.KEY_DOWN) {
            isDown[event.key] = true;
         } else {
            isDown[event.key] = false;
         }
      })
   }

   this.update = function(msDuration) {
      var factor = msDuration / 1000;
      /*if (isDown[gamejs.event.K_d]) {
         playerPosition[0] -= (factor * 10);
      } else if (isDown[gamejs.event.K_a]) {
         playerPosition[0] += (factor * 10);
      }
      playerPosition[0] = Math.min(Math.max(300, playerPosition[0]), 700);
      */
      if (playerPosition[0] > origPosition[0] + sway) {
         playerPosition[0] = origPosition[0] + sway;
         swayDirection = -1;
      } else if (playerPosition[0] < origPosition[0] - sway) {
         playerPosition[0] = origPosition[0] - sway;
         swayDirection = +1;

      }
      //playerPosition[0] += (swayDirection * factor * 5);
      this.offset = $v.subtract(origPosition, playerPosition);
   }

   return this;
}

exports.Game = function() {
   sounds.init();
   require('./weapon').init();

   this.caption = "Shooter v0.1"
   var perspective = new Perspective();
   var crosshair = new Crosshair();
   var weapon = new Weapon();
   var sun = new sprites.Sun();

   var rushGroup = new gamejs.sprite.Group();

   var coverGroup = new gamejs.sprite.Group();
   for (var i = 0; i<8; i++) {
      coverGroup.add(new sprites.Cover());
   }

   var explosionGroup = new gamejs.sprite.Group();

   var spawnRushers = function() {
      for (var i = 0; i<20; i++) {
         rushGroup.add(new sprites.Rusher());
      }
   }

   var sortedSprites = [];
   this.update = function(msDuration) {
      var rushSprites = rushGroup.sprites();
      if (rushSprites.length <= 5) {
         spawnRushers();
      }
      // handle key / mouse events
      crosshair.handle(gamejs.event.get(gamejs.event.MOUSE_MOTION));
      weapon.handle(gamejs.event.get([gamejs.event.MOUSE_DOWN, gamejs.event.MOUSE_UP]));
      var keyEvents = gamejs.event.get([gamejs.event.KEY_DOWN, gamejs.event.KEY_UP]);
      weapon.handle(keyEvents);
      perspective.handle(keyEvents);

      gamejs.event.get();

      var bullets = weapon.update(msDuration, crosshair);
      explosionGroup.update(msDuration);
      perspective.update(msDuration);
      crosshair.update(msDuration, weapon);
      rushGroup.update(msDuration);
      // @@ could re-order during move for perf
      sortedSprites = rushSprites.
         concat(coverGroup.sprites()).
         concat(explosionGroup.sprites()).
         filter(function(s) {
            if (s.pos3d[2] <= 0.5 || s.isDead() || s.rect && (s.rect.right < 0 || s.rect.left > 2000)) {
               s.kill();
               return false;
            }
            if (s.health !== undefined && s.health <= 0) {
               var imgSurface = new gamejs.Surface(s.rect);
               imgSurface.blit(s.image, new gamejs.Rect([0,0], [s.rect.width, s.rect.height]))
               var exp = new Explosion(imgSurface, perspective.to2d(s.pos3d), s.pos3d, [0, -1]);
               s.kill();
               sounds.play('splash' + (Math.random() * 5 | 0));
               explosionGroup.add(exp);
               return false;
            }
            return true;
         }
      );
      sortedSprites.sort(function(a,b) {
         if (a.pos3d[2] > b.pos3d[2]) {
            return 1;
         } else if (a.pos3d[2] < b.pos3d[2]) {
            return -1;
         } else {
            if (a.pos3d[0] < b.pos3d[0]) {
               return 1;
            }
            return -1;
         }
      });
      if (bullets) {
         bullets.forEach(function(b) {
            sortedSprites.some(function(sprite) {
               if (sprite.rect && sprite.rect.collidePoint(b)) {
                  sprite.bulletHole(b, weapon);
                  return true;
               }
            });
         });
      };
      sortedSprites.reverse();
   };

   this.draw = function(display) {
      display.fill('#a9ff00');
      gamejs.draw.rect(display, '#0000ff', new gamejs.Rect([0,0], [display.getSize()[0], 200]));
      sun.draw(display, perspective)
      sortedSprites.forEach(function(sprite) {
         sprite.draw(display, perspective);
      });
      crosshair.draw(display);
      weapon.draw(display);
   }
   return this;
}