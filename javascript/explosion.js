var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');
var particles = require('./particles');
var prng = require('./prng');

var Explosion = exports.Explosion = function(image, pos, pos3d, direction) {
   Explosion.superConstructor.apply(this, []);

   this.age = 0;
   this.pos3d = pos3d;
   // split big image into parts
   this.parts = [];
   var size = image.getSize();
   for (var i=0; i<size[0]; ) {
      w = prng.rand(Explosion.MIN_SIZE, Explosion.MAX_SIZE);
      for (var j=0; j<size[1]; ) {
         h = prng.rand(Explosion.MIN_SIZE, Explosion.MAX_SIZE);
         var s = new gamejs.Surface(w, h);
         s.blit(image, new gamejs.Rect(0,0, w, h), new gamejs.Rect(i, j, w, h));
         this.parts.push({
            rect: new gamejs.Rect([i - size[0]/2, j - size[1]/2], [w, h]),
            image: s,
            v: $v.unit($v.add(direction, [prng.rand(-0.5,0.5), prng.rand(-0.5,0.5)]))
         });
         j += h;
      }
      i += w;
   }
  this.explosion = new particles.Emitter({
    delay: 50,
    numParticles: 40,
    //modifierFunc: particles.Modifiers.tail(2, 0.4, 'rgb(255, 0, 0)', $v.multiply(dir, -1))
    modifierFunc: particles.Modifiers.explosion(10, 1, "rgba(143,116,51,0.6)")
  });
  this.explosion.pos = pos;
  this.explosion.pos3d = pos3d;
  this.explosion.start();
  return this;
}
gamejs.utils.objects.extend(Explosion, gamejs.sprite.Sprite);

Explosion.prototype.update = function(msDuration) {
   this.explosion.update(msDuration);
   this.parts.forEach(function(p, idx) {
      p.rect.center = $v.add(p.rect.center, $v.multiply(p.v, (msDuration/1000) * Explosion.SPEED));
      p.rect.width *= (1 - (msDuration/1000) * Explosion.SIZE_DECREASE);
      p.rect.height *= (1 - (msDuration/1000) * Explosion.SIZE_DECREASE);
   });
   this.age += msDuration;
   if (this.age > Explosion.LIFETIME) {
      this.explosion.stop();
      this.explosion = null;
      this.kill();
   } else if (this.age > Explosion.EMITTER_LIFETIME) {
      this.explosion.stop();
   }
}

Explosion.SPEED = 200;
Explosion.MIN_SIZE = 5;
Explosion.MAX_SIZE = 10;
Explosion.LIFETIME = 400; //ms
Explosion.EMITTER_LIFETIME = 100;
Explosion.SIZE_DECREASE = 0.9; // per sec

Explosion.prototype.draw = function(display, perspective) {
   this.explosion.draw(display, perspective);
   this.parts.forEach(function(p) {
      var pos = $v.add(perspective.to2d(this.pos3d), p.rect.topleft);
      display.blit(p.image, pos);
   }, this);
}