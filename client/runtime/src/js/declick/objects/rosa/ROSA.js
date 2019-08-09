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

  ROSA.prototype._moveForward = function() {};
  ROSA.prototype._moveBack = function() {};
  ROSA.prototype._turnRight = function() {};
  ROSA.prototype._turnLeft = function() {};
  ROSA.prototype._rotateRight = function() {};
  ROSA.prototype._rotateLeft = function() {};
  ROSA.prototype._backRight = function() {};
  ROSA.prototype._backLeft = function() {};
  ROSA.prototype._stop = function() {};
  ROSA.prototype._measureDistance = function() {};
  ROSA.prototype._setRSpeed = function() {};
  ROSA.prototype._setLSpeed = function() {};
  ROSA.prototype._obstacle = function() {};
  ROSA.prototype._setMaxDist = function() {};
  ROSA.prototype._setMinDis = function() {};

  return ROSA;
});
