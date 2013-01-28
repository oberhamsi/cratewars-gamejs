var gamejs = require('gamejs');

var sounds = require('./sounds');
var weaponStats = null;
exports.init = function() {
   weaponStats = {
      'shotgun': {
         rateOfFire: 300,
         spread: 60, // px
         maxRecoil: 10, // px
         bullets: 8,
         sound: sounds.get('shotgun'),
         bulletDamage: 1.5
      },
      'pistol': {
         rateOfFire: 200,
         spread: 10, // px
         maxRecoil: 20, // px
         bullets: 1,
         sound: sounds.get('pistol'),
         bulletDamage: 4
      },
      'chaingun': {
         rateOfFire: 110,
         spread: 30, // px
         maxRecoil: 30, // px
         bullets: 1,
         sound: sounds.get('cg1'),
         bulletDamage: 2,
         isAuto: true
      }
   }
};

exports.Weapon = function() {
   var recoils = [];
   var recoilForce = 0;
   var recoilDuration = 200; //ms
   var stats = weaponStats.pistol;
   var lastFired = null;
   var isDown = false;
   var downFired = 0;

   this.handle = function(events) {
      events.forEach(function(event) {
         if (event.type === gamejs.event.MOUSE_DOWN) {
            isDown = true;
         } else if (event.type === gamejs.event.MOUSE_UP) {
            isDown = false;
            downFired = 0;
         } else if (event.type === gamejs.event.KEY_UP) {
            if (event.key === gamejs.event.K_1) {
               stats = weaponStats.pistol
            } else if (event.key === gamejs.event.K_2) {
               stats = weaponStats.shotgun;
            } else if (event.key === gamejs.event.K_3) {
               stats = weaponStats.chaingun;
            }
         }
      }, this);
   }

   var fire = function(crosshair) {
      var now = Date.now();
      if (now - lastFired < stats.rateOfFire) {
         return null;
      }
      stats.sound.play();
      var cc = crosshair.getCenter();
      var poses = [];
      for (var i = 0; i < stats.bullets;i++) {
         var pos = [
            cc[0] + (-stats.spread/2 + (Math.random() * stats.spread)),
            cc[1] + (-stats.spread/2 + (Math.random() * stats.spread))
         ];
         recoils.push({
            start: now,
            pos: pos
         });
         poses.push(pos);
      }

      lastFired = now;
      return poses;
   }

   this.getDamage = function() {
      return stats.bulletDamage;
   }

   this.update = function(msDuration, crosshair) {
      var bullets = null;
      if (isDown && (stats.isAuto || downFired <= 0)) {
         bullets = fire(crosshair);
         downFired++;
      }
      recoilForce = 0;
      recoils = recoils.filter(function(recoil) {
         var duration = Date.now() - recoil.start;
         if (duration >= recoilDuration) {
            return false;
         }
         var x = duration / recoilDuration;
         if (x > 0.7) {
            recoilForce -= 0.2;
         } else {
            recoilForce += (5 * x * Math.pow(Math.E, (1 - 9 * x)));
         }
         return true;
      });
      this.recoilForce = stats.maxRecoil * recoilForce;
      return bullets;
   };

   this.draw = function(display) {
      recoils.forEach(function(recoil) {
         gamejs.draw.circle(display, 'white', recoil.pos, 2, 0);
      });
   }

   return this;
}