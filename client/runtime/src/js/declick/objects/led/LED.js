define(["TObject"], function(TObject) {
  /**
   * Defines LED, inherited from TObject.
   * It's an object for arduino to control a LED
   * @exports LED
   */
  var LED = function() {
    TObject.call(this);

    this.logs = [];
  };

  LED.prototype = Object.create(TObject.prototype);
  LED.prototype.constructor = LED;
  LED.prototype.className = "LED";

  LED.prototype._on = function() {};
  LED.prototype._off = function() {};

  return LED;
});
