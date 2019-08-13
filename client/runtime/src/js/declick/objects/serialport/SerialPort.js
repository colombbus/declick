define(["TObject"], function(TObject) {
  /**
   * Defines SerialPort, inherited from TObject.
   * It's an object for arduino to communicate with serial port
   * @exports SerialPort
   */
  var SerialPort = function() {
    TObject.call(this);

    this.logs = [];
  };

  SerialPort.prototype = Object.create(TObject.prototype);
  SerialPort.prototype.constructor = SerialPort;
  SerialPort.prototype.className = "SerialPort";

  SerialPort.prototype._send= function() {};
  SerialPort.prototype._receive= function() {};
  SerialPort.prototype._receiveFloat= function() {};
  SerialPort.prototype._receiveInt= function() {};
  SerialPort.prototype._setTimeout= function() {};
  SerialPort.prototype._isConnected= function() {};
  SerialPort.prototype._start= function() {};
  SerialPort.prototype._end= function() {};
  SerialPort.prototype._clearBuffer= function() {};

  return SerialPort;
});
