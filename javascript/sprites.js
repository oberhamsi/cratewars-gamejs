var gamejs = require('gamejs');
var $v = require('gamejs/utils/vectors');

// @@ ugh
gamejs.sprite.Sprite.prototype.bulletHole = function(pos, weapon) {
   var pos = $v.subtract(pos, this.rect.topleft);
   pos = [
      (pos[0] / this.rect.width) * this.size[0],
      (pos[1] / this.rect.height) * this.size[1]
   ];
   if (this.health !== undefined) {
      this.health -= weapon.getDamage();
   }
   var r = new gamejs.Rect([0,0], [5,5])
   r.center = pos;
   this.image.clear(r)
}


var Rusher = exports.Rusher = function() {
   Rusher.superConstructor.apply(this, arguments);
   //this.size = [30,30];
   this.pos3d = [Math.random() * 800, 0, Math.random() * 0.5 +  3.6];
   this.move3d = [- 25 + Math.random()*50, 0, -0.1];
   this.rect = new gamejs.Rect([0,0]);
   //this.rect.center = to2d(this.pos3d);
   this.image = gamejs.image.load('./images/crate.png');
   this.size = this.image.getSize();
   this.health = 8;
   return this;
}
gamejs.utils.objects.extend(Rusher, gamejs.sprite.Sprite);

Rusher.prototype.update = function(msDuration) {
   var factor = msDuration / 1000;
   //console.log(this.pos3d)
   this.pos3d = [
      this.pos3d[0] + (this.move3d[0] * factor),
      this.pos3d[1] + (this.move3d[1] * factor),
      this.pos3d[2] + (this.move3d[2] * factor)
   ]

   this.rect.width =  this.size[0] /  (this.pos3d[2]/4)
   this.rect.height = this.size[1] / (this.pos3d[2]/4)
   //console.log(this.rect.center)
}

Rusher.prototype.draw = function(display, perspective) {
   this.rect.center = perspective.to2d(this.pos3d);
   display.blit(this.image, this.rect);
   gamejs.draw.rect(display, '#000000', this.rect, 2)
}

var Cover = exports.Cover = function() {
   Cover.superConstructor.apply(this, arguments);
   var z = 0.2 + Math.random()* 4.1;
   z = z - (z%0.3);
   this.pos3d = [100 + Math.random() * 400, 0, z];
   this.image = gamejs.image.load('./images/cover.png');
   this.size = this.image.getSize();
   this.rect = new gamejs.Rect([0,0])
   //this.rect.center = to2d(this.pos3d);
   this.rect.width = this.size[0] / (this.pos3d[2] / 4);
   this.rect.height = this.size[1] / (this.pos3d[2] / 4);
   return this;
}

gamejs.utils.objects.extend(Cover, gamejs.sprite.Sprite);

Cover.prototype.draw = function(display, perspective) {
   this.rect.center = perspective.to2d(this.pos3d);
   display.blit(this.image, this.rect);
}

var Sun = exports.Sun = function() {
   this.pos3d = [700, 0, 5.2];
   this.image = gamejs.image.load('./images/sun.png');
   this.size = this.image.getSize();
   this.rect = new gamejs.Rect([0,0]);
   this.rect.width =  this.size[0] /  (this.pos3d[2]/4)
   this.rect.height = this.size[1] / (this.pos3d[2]/4)


   this.draw = function(display, perspective) {
      this.rect.center = perspective.to2d(this.pos3d);
      display.blit(this.image, this.rect);
   }
   return this;
}