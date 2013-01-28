var $v = require('gamejs/utils/vectors');
var gamejs = require('gamejs');

exports.Crosshair = function() {
   var originalImage = gamejs.image.load('./images/crosshair.png');
   var rect = new gamejs.Rect([0,0], originalImage.getSize());
   rect.center = [window.innerWidth /2, window.innerHeight /2];
   var image = originalImage.clone();

   var sample = {
      startTime : null,
      sum: 0,
      newSum: 0,
      last: null
   };
   var SAMPLE_LENGTH = 150;
   var accuracy = 1.0;

   this.handle = function(motionEvents) {
      if (sample.startTime >= SAMPLE_LENGTH) {
         sample.startTime = Date.now();
         sample.sum = newSum;
         sample.newSum = 0;
      }
      sample.last = [0,0];
      motionEvents.forEach(function(event) {
         sample.last = $v.add(sample.last, [event.movementX, event.movementY]);
      });
      sample.newSum += $v.len(sample.last);
   }
   this.update = function(msDuration, weapon) {
      rect.center = $v.add(rect.center, [0, -weapon.recoilForce]);
      rect.center = $v.add(rect.center, sample.last);
   }

   this.draw = function(surface) {
      surface.blit(image, rect);
   }

   this.getCenter = function() {
      return rect.center.slice(0);
   }

   return this;
}