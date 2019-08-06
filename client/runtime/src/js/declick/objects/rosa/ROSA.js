define(["TObject"], function(TObject) {
  /**
   * Defines ROSA, inherited from TObject.
   * It's an object for arduino to control ROSA
   * @exports ROSA
   */
  var ROSA = function() {
    TObject.call(this);
  };

  ROSA.prototype = Object.create(TObject.prototype);
  ROSA.prototype.constructor = ROSA;
  ROSA.prototype.className = "ROSA";

  // TObject

  for (var i of [
    "_moveForward",
    "_moveBack",
    "_turnRight",
    "_turnLeft",
    "_rotateRight",
    "_rotateLeft",
    "_stop",
    "_measureDistance",
    "_setRSpeed",
    "_setLSpeed",
    "_obstacle",
    "_setMaxDist",
    "_setMinDist"
  ])
    ROSA.prototype[i] = function() {};

  return ROSA;
});
