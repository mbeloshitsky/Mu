/**
 * blocking.js - Mu templates blocking test.
 */

var sys = require('sys');
var Mu = require('../lib/mu');

var ticker = (function () {

   var tick = 0, stopped = true;

   function next () {
      tick++;
      if (!stopped) process.nextTick(next);
   }

   return {
      start: function () { stopped = false; next() },
      stop: function () { stopped = true; },
      reset: function () { tick = 0 },
      ticks: function () { return tick }
   }

})();

var hugeJs = {
   header: "Colors",
   item: [
      {name: "green", current: false, url: "#Green"},
      {name: "blue", current: false, url: "#Blue"}
   ],
   link: function() {
      return this["current"] !== true;
   },
   list: function() {
      return this.item.length !== 0;
   },
   empty: function() {
      return this.item.length === 0;
   }
}

/* Fill up huge Js object */
for (var i = 0; i < 100000; i++) {
   hugeJs.item.push({name: "submarine", current: true, url: "#Yellow"})
}

Mu.templateRoot = '../examples';

Mu.compile('complex.html', function (err, compiled) {
   if (err) throw err;

   var start = new Date;

   ticker.start();

   compiled(hugeJs).addListener('data', function (c) { })
        .addListener('end', function () {
           var duration = (new Date) - start;
           ticker.stop();
           console.log('*** Mu templating')
           console.log('  Ticks: ' + ticker.ticks())
           console.log('  Time: ' + duration +'ms')
           stage2(duration);
        });
})

function stage2 (duration) {
   ticker.reset();
   ticker.start();
   var start = new Date;
   setTimeout(function () {
      ticker.stop();
      console.log('*** Idle time')
      console.log('  Ticks: ' + ticker.ticks())
      console.log('  Time: ' + ((new Date) - start) +'ms')
   }, duration);
}
