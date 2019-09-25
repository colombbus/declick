define([
  "jquery",
  "TObject",
  "TUI",
  "TLink",
  "SynchronousManager",
  "TError",
  "TEnvironment",
  "TParser"
], function($, TObject, TUI, TLink, SyncMan, TError, TEnvironment, TParser) {
  /**
   * Defines Arduino, inherited from TObject.
   * It's an object used to communicate and transfert code to an arduino board
   * @exports Arduino
   */
  var Arduino = function() {
    TObject.call(this);

    if (typeof Arduino.boardSelector === "undefined") {
      Arduino.boardSelector = this._initBoardSelector();
    }
    if (typeof Arduino.syncMan === "undefined") {
      Arduino.syncMan = new SyncMan();
    }
    if (typeof Arduino.boardList === "undefined") {
      this._updateBoardsList();
    }
    if(typeof Arduino.compileStatus === "undefined"){
      Arduino.compileStatus = false;
    }
    if(typeof Arduino.uploadStatus === "undefined"){
      Arduino.uploadStatus = false;
    }

    this.modules = ["declick.h"]; //modules used for compilation
    this.data = null; //arduino code
    this.port = null; //port on which the arduino board is connected
    this.fqbn = null; //board's idenfifier
    this._createLogger()
    this._createLoggerToggle()
  };

  Arduino.prototype = Object.create(TObject.prototype);
  Arduino.prototype.constructor = Arduino;
  Arduino.prototype.className = "Arduino";

  /**
   * convert declick code to arduino code
   *
   * @param {node} node : code's statements
   * @param {map} vars : will contain declared vars in the setup function
   * @param {string} parentFonction : name of the parent function
   *
   * @returns {string} arduino code (without vars declarations)
   *
   * @todo replace declaration with var by declaration with let when it will available
   */
  Arduino.prototype._declickToArduino = function(node, vars, parentFonction) {
    if (typeof vars === "undefined") {
      vars = new Map();
    }
    if (typeof parentFonction === "undefined") {
      parentFonction = null;
    }
    var arduinoCode = "";

    if (node === null) {
      return "";
    }

    switch (node.type) {
      case "Program":
        arduinoCode = '#line 1 "' + node.loc.source + '"\n';

        for (var n in node.body) {
          if (
            (node.body[n].type == "FunctionDeclaration" &&
              node.body[n].id.name ===
                Arduino.prototype.getMessage("setupFunction")) ||
            node.body[n].id.name ===
              Arduino.prototype.getMessage("loopFunction")
          ) {
            node.body.push(node.body[n]);
            node.body.splice(n, 1);
          }
        }

        for (var i in node.body) {
          arduinoCode += "#line " + node.body[i].loc.start.line + "\n";
          arduinoCode += this._declickToArduino(
            node.body[i],
            vars,
            parentFonction
          );
          arduinoCode += ";\n";
        }
        break;

      case "BreakStatement":
        arduinoCode = "break";
        break;

      case "ContinueStatement":
        arduinoCode = "continue";
        break;

      case "DoWhileStatement":
        arduinoCode = "do\n";
        arduinoCode += "#line " + node.body.loc.start.line + "\n";
        arduinoCode += this._declickToArduino(node.body, vars, parentFonction);
        arduinoCode += "#line " + node.test.loc.start.line + "\n";
        arduinoCode += "while(";
        arduinoCode += this._declickToArduino(node.test, vars, parentFonction);
        arduinoCode += ")";
        break;

      case "IfStatement":
        arduinoCode = "if(";
        arduinoCode += this._declickToArduino(node.test, vars, parentFonction);
        arduinoCode += ")\n";
        arduinoCode += "#line " + node.consequent.loc.start.line + "\n";
        arduinoCode += this._declickToArduino(
          node.consequent,
          vars,
          parentFonction
        );
        if (node.alternate !== null) {
          arduinoCode += "else\n";
          arduinoCode += "#line " + node.alternate.loc.start.line + "\n";
          arduinoCode += this._declickToArduino(
            node.alternate,
            vars,
            parentFonction
          );
        }
        break;

      case "ReturnStatement":
        arduinoCode = "return(";
        arduinoCode += this._declickToArduino(
          node.argument,
          vars,
          parentFonction
        );
        arduinoCode += ")";
        break;

      case "SwitchStatement":
        arduinoCode = "switch(";
        arduinoCode += this._declickToArduino(
          node.discriminant,
          vars,
          parentFonction
        );
        arduinoCode += ") {\n";
        for (var i in node.cases) {
          arduinoCode += "#line " + node.cases[i].loc.start.line + "\n";
          arduinoCode += this._declickToArduino(
            node.cases[i],
            vars,
            parentFonction
          );
          arduinoCode += ";\n";
        }
        arduinoCode += "}";
        break;

      case "SwitchCase":
        if (node.test !== null) {
          arduinoCode = "case (";
          arduinoCode += this._declickToArduino(
            node.test,
            vars,
            parentFonction
          );
          arduinoCode += "):\n";
        } else {
          arduinoCode = "default :\n";
        }
        for (var i in node.consequent) {
          arduinoCode += this._declickToArduino(
            node.consequent[i],
            vars,
            parentFonction
          );
          arduinoCode += ";\n";
        }
        break;

      case "WhileStatement":
        arduinoCode = "while(";
        arduinoCode += this._declickToArduino(node.test, vars, parentFonction);
        arduinoCode += ")\n";
        arduinoCode += "#line " + node.body.loc.start.line + "\n";
        arduinoCode += this._declickToArduino(node.body, vars, parentFonction);
        break;

      case "EmptyStatement":
        arduinoCode = "";
        break;

      case "ExpressionStatement":
        arduinoCode = this._declickToArduino(
          node.expression,
          vars,
          parentFonction
        );
        break;

      case "BlockStatement":
        arduinoCode = "{\n";
        for (var i in node.body) {
          arduinoCode += "#line " + node.body[i].loc.start.line + "\n";
          arduinoCode += this._declickToArduino(
            node.body[i],
            vars,
            parentFonction
          );
          arduinoCode += ";\n";
        }
        arduinoCode += "}";
        break;

      case "ForStatement":
        arduinoCode = "for (";
        arduinoCode += this._declickToArduino(node.init, vars, parentFonction);
        arduinoCode += "; ";
        arduinoCode += this._declickToArduino(node.test, vars, parentFonction);
        arduinoCode += "; ";
        arduinoCode += this._declickToArduino(
          node.update,
          vars,
          parentFonction
        );
        arduinoCode += ")\n";
        arduinoCode += "#line " + node.body.loc.start.line + "\n";
        arduinoCode += this._declickToArduino(node.body, vars, parentFonction);
        break;

      case "RepeatStatement":
        if (node.count === null) {
          arduinoCode = "while (true)\n";
        } else {
          do {
            var rand =
              "i_" +
              Math.random()
                .toString(36)
                .replace("0.", "");
          } while (node.raw.indexOf(rand) != -1);

          arduinoCode = "for (int " + rand + "=0; " + rand + "<";
          arduinoCode += this._declickToArduino(
            node.count,
            vars,
            parentFonction
          );
          arduinoCode += "; ++" + rand + ")\n";
        }
        arduinoCode += "#line " + node.body.loc.start.line + "\n";
        arduinoCode += this._declickToArduino(node.body, vars, parentFonction);
        break;

      case "AssignmentExpression":
        if (parentFonction == "setup" && node.left.type == "Identifier") {
          vars.set(node.left.name, node.right);
        }
        arduinoCode = this._declickToArduino(node.left, vars, parentFonction);
        arduinoCode += " ";
        arduinoCode += node.operator;
        arduinoCode += " (";
        arduinoCode += this._declickToArduino(node.right, vars, parentFonction);
        arduinoCode += ")";
        break;

      case "ConditionalExpression":
        arduinoCode = "(";
        arduinoCode += this._declickToArduino(node.test, vars, parentFonction);
        arduinoCode += ") ? (";
        arduinoCode += this._declickToArduino(
          node.consequent,
          vars,
          parentFonction
        );
        arduinoCode += ") : (";
        arduinoCode += this._declickToArduino(
          node.alternate,
          vars,
          parentFonction
        );
        arduinoCode += ")";
        break;

      case "LogicalExpression":
        arduinoCode = "(";
        arduinoCode += this._declickToArduino(node.left, vars, parentFonction);
        arduinoCode += ") ";
        arduinoCode += node.operator;
        arduinoCode += " (";
        arduinoCode += this._declickToArduino(node.right, vars, parentFonction);
        arduinoCode += ")";
        break;

      case "BinaryExpression":
        arduinoCode = "(";
        arduinoCode += this._declickToArduino(node.left, vars, parentFonction);
        arduinoCode += ") ";
        arduinoCode += node.operator;
        arduinoCode += " (";
        arduinoCode += this._declickToArduino(node.right, vars, parentFonction);
        arduinoCode += ")";
        break;

      case "UpdateExpression":
        vars;
        if (node.prefix) {
          arduinoCode = "(";
          arduinoCode += this._declickToArduino(
            node.argument,
            vars,
            parentFonction
          );
          arduinoCode += ") ";
          arduinoCode += node.operator;
        } else {
          arduinoCode = node.operator;
          arduinoCode += " (";
          arduinoCode += this._declickToArduino(
            node.argument,
            vars,
            parentFonction
          );
          arduinoCode += ")";
        }
        break;

      case "UnaryExpression":
        if (!node.prefix) {
          arduinoCode = "(";
          arduinoCode += this._declickToArduino(
            node.argument,
            vars,
            parentFonction
          );
          arduinoCode += ") ";
          arduinoCode += node.operator;
        } else {
          arduinoCode = node.operator;
          arduinoCode += " (";
          arduinoCode += this._declickToArduino(
            node.argument,
            vars,
            parentFonction
          );
          arduinoCode += ")";
        }
        break;

      case "MemberExpression":
        arduinoCode = "(";
        arduinoCode += this._declickToArduino(
          node.object,
          vars,
          parentFonction
        );
        arduinoCode += ")";
        if (node.computed === true) {
          arduinoCode += "[";
          arduinoCode += this._declickToArduino(
            node.property,
            vars,
            parentFonction
          );
          arduinoCode += "]";
        } else {
          arduinoCode += ".";
          arduinoCode += this._declickToArduino(
            node.property,
            vars,
            parentFonction
          );
        }
        break;

      case "CallExpression":
        arduinoCode = this._declickToArduino(node.callee, vars, parentFonction);
        arduinoCode += "(";
        for (var arg in node.arguments) {
          if (arg !== "0") {
            arduinoCode += ", ";
          }
          arduinoCode += "(";
          arduinoCode += this._declickToArduino(
            node.arguments[arg],
            vars,
            parentFonction
          );
          arduinoCode += ")";
        }
        arduinoCode += ")";
        break;

      case "ThisExpression":
        arduinoCode = "this";
        break;

      case "NewExpression":
        arduinoCode = this._declickToArduino(node.callee, vars, parentFonction);
        arduinoCode += "(";
        for (var arg in node.arguments) {
          if (arg !== "0") {
            arduinoCode += ", ";
          }
          arduinoCode += "(";
          arduinoCode += this._declickToArduino(
            node.arguments[arg],
            vars,
            parentFonction
          );
          arduinoCode += ")";
        }
        arduinoCode += ")";
        break;

      case "Identifier":
        arduinoCode = node.name;
        break;

      case "Literal":
        if (typeof node.value == "string") {
          arduinoCode = '"';
          arduinoCode += String(node.value);
          arduinoCode += '"';
        } else {
          arduinoCode = String(node.value);
        }
        break;

      case "VariableDeclaration":
        arduinoCode = "auto ";

        for (var decl in node.declarations) {
          if (decl !== "0") {
            arduinoCode += ", ";
          }
          arduinoCode += this._declickToArduino(
            node.declarations[decl],
            vars,
            parentFonction
          );
        }

        break;

      case "VariableDeclarator":
        if (node.init === null) {
          var error = new TError(
            "you must assign a value when you declare a variable in arduino"
          );

          error.setLines([node.loc.start.line, node.loc.end.line]);
          error.detectError();
          error.setProgramName(node.loc.source);

          TUI.addLogError(error);
          throw "you must assign a value when you declare a variable in arduino";
        }

        arduinoCode = this._declickToArduino(node.id, vars, parentFonction);
        arduinoCode += " = ";
        arduinoCode += this._declickToArduino(node.init, vars, parentFonction);
        break;

      case "FunctionDeclaration":
        parentFonction = node.id.name;
        if (parentFonction === Arduino.prototype.getMessage("setupFunction")) {
          parentFonction = "setup";
        } else if (
          parentFonction === Arduino.prototype.getMessage("loopFunction")
        ) {
          parentFonction = "loop";
        }
        if (parentFonction == "setup" || parentFonction == "loop") {
          arduinoCode = "void ";
          arduinoCode += parentFonction;
          arduinoCode += "(";
        } else {
          do {
            var rand =
              "myType_" +
              Math.random()
                .toString(36)
                .replace("0.", "");
          } while (node.raw.indexOf(rand) != -1);

          for (var param in node.params) {
            if (param != 0) {
              arduinoCode += ", ";
            } else {
              arduinoCode = "template<";
            }
            arduinoCode += "class " + rand;
            arduinoCode += param;
          }
          if (param !== undefined) arduinoCode += ">\n";
          arduinoCode += "#line " + node.id.loc.start.line + "\n";
          arduinoCode += "auto ";
          arduinoCode += this._declickToArduino(node.id, vars, parentFonction);
          arduinoCode += " (";
          for (var param in node.params) {
            if (param !== "0") {
              arduinoCode += ", ";
            }
            arduinoCode += rand;
            arduinoCode += param;
            arduinoCode += " ";
            arduinoCode += this._declickToArduino(
              node.params[param],
              vars,
              parentFonction
            );
          }
        }
        arduinoCode += ")\n";
        arduinoCode += "#line " + node.body.loc.start.line + "\n";
        arduinoCode += this._declickToArduino(node.body, vars, parentFonction);
        break;

      default:
        var error = new TError(node.type + " can't be used with arduino");

        error.setLines([node.loc.start.line, node.loc.end.line]);
        error.detectError();
        error.setProgramName(node.loc.source);

        TUI.addLogError(error);
        throw node.type + " can't be used with arduino";
    }

    return arduinoCode;
  };

  /**
   * get list of supported boards for Arduino.boardSelector
   * and initialise Arduino.daemon
   */
  Arduino.prototype._updateBoardsList = function() {
    Arduino.syncMan.begin();
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        Arduino.boardList = JSON.parse(this.responseText);

        Arduino.boardSelector.children("#arduinoSelectOtherBoard").empty();

        for (var board in Arduino.boardList) {
          if (Arduino.boardList[board] != null)
            Arduino.boardSelector
              .children("#arduinoSelectOtherBoard")
              .append(
                "<option value='" +
                  board +
                  "'>" +
                  Arduino.boardList[board].name +
                  "</option>"
              );
        }

        if (Arduino.daemon === undefined) {
          Arduino.daemon = new ArduinoCreateAgentDaemon(TEnvironment.getConfig("arduino-builder-url"));
          Arduino.prototype._setupArdCreAgtDaemon();
        }

        Arduino.syncMan.end();
      }
    };

    xhr.open("GET", TEnvironment.getConfig("arduino-builder-url")+"boards.php");
    xhr.send();
  };

  /**
   * configure daemon's behaviour
   */
  Arduino.prototype._setupArdCreAgtDaemon = function() {
    var self = Arduino.prototype;

    Arduino.daemon.messageBuffer = "";

    Arduino.daemon.serialMonitorMessages.subscribe(function(message){
      if(Arduino.daemon.messageBuffer.length + message.length < 1000000){
        Arduino.daemon.messageBuffer += message;
      }
    });

    Arduino.daemon.agentFound.subscribe(function(status) {
      if (status) {
        TUI.addLogMessage(self.getMessage("agentCo"));
      } else {
        TUI.addLogMessage(self.getMessage("agentNotCo"));
      }
    });

    Arduino.daemon.channelOpenStatus.subscribe(function(status) {
      if (status) {
        TUI.addLogMessage(self.getMessage("channelOpen"));
      } else {
        TUI.addLogMessage(self.getMessage("channelClose"));
      }
    });

    Arduino.daemon.error.subscribe(function(err) {
      if (err !== null) {
        TEnvironment.log(613, "arduino create agent error :");
        TEnvironment.log(614, err);
        TUI.addLogError(Error(err));
      }
    });

    Arduino.daemon.devicesList.subscribe(function(boards) {
      var serial = boards.serial;
      var network = boards.network;

      Arduino.boardSelector.children("#arduinoSelectBoard").empty();

      for (var i in serial) {
        var boardInfo = self._getBoardInfo(
          serial[i].ProductID,
          serial[i].VendorID
        );
        Arduino.boardSelector
          .children("#arduinoSelectBoard")
          .append(
            "<option value='" +
              JSON.stringify({ board: boardInfo.fqbn, port: serial[i].Name }) +
              "' >" +
              self.getMessage("boardPort", boardInfo.name, serial[i].Name) +
              "</option>"
          );
      }

      Arduino.boardSelector
        .children("#arduinoSelectBoard")
        .append(
          "<option value='other'>" + self.getMessage("other") + "</option>"
        );

      self._updateSelectBoard();
    });

    // Upload progress
    Arduino.daemon.uploading.subscribe(function(upload) {
      // TEnvironment.log(652, Arduino);
      var msg = upload.msg ? upload.status + ' : ' + upload.msg : upload.status;
      Arduino.prototype._addLogMessage(msg);
      if (upload.status == "UPLOAD_IN_PROGRESS") {
        TUI.addLogMessage(upload.msg);
      } else if (upload.status == "UPLOAD_DONE") {
        TUI.addLogMessage(self.getMessage("uploadSuccess"));
        Arduino.uploadStatus = true;
        Arduino.syncMan.end();

      } else if (upload.status == "UPLOAD_ERROR") {
        TUI.addLogError(Error(self.getMessage("uploadFail")));
        Arduino.uploadStatus = false;
        Arduino.syncMan.end();
      }
    });

    // Download status
    Arduino.daemon.downloading.subscribe(function(download) {
      // TEnvironment.log(670, download);
      var msg = download.msg ? download.status + ' : ' + download.msg : download.status;
      Arduino.prototype._addLogMessage(msg);
    });
  };

  /**
   * compile code through an server
   *
   * this.data must contain arduino's syntax code
   * this.fqbn can contain arduino's identifier (if not it will be asked in a popup)
   *
   * if upload is true, upload the compiled code on the arduino board
   * and this.port can contain arduino's port (if not it will be asked in a popup)
   *
   * @param {boolean} upload
   */
  Arduino.prototype._compileCode = function(upload) {
    if (!this.fqbn || (upload && !this.port)) {
      this._askBoard(upload);
      return;
    }

    Arduino.prototype._addLogMessage(this.data);

    Arduino.syncMan.begin();

    var xhr = new XMLHttpRequest();

    xhr.arduino = this;

    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var res = JSON.parse(this.responseText);

        if (res["status"]) {
          //compilation succedeed
          TUI.addLogMessage(Arduino.prototype.getMessage("compilationSuccess"));

          Arduino.compileStatus = true;

          if (upload) {
            Arduino.daemon.uploadSerial(
              { port: this.arduino.port, board: this.arduino.fqbn },
              "test",
              res,
              true
            );
          }
        } else {

          Arduino.compileStatus = false;

          TEnvironment.log(725, res["stderr"]);

          var e;
          var error;
          var regex = /^(.*):(\d*):(\d*): error: (.*)$/gm;

          while ((e = regex.exec(res["stderr"]))) {
            TEnvironment.log(632, "error : " + e[4] + " (line " + e[2] + ")");
            error = new TError(e[1] + " : " + e[4]);
            error.setLines([e[2], e[2]]);
            error.detectError();
            error.setProgramName(e[1]);

            TUI.addLogError(error);
          }

          TUI.addLogError(Error(this.arduino.getMessage("compilationFail")));
        }

        if(!upload){
          Arduino.syncMan.end();
        }
      }
    };

    xhr.open("POST", TEnvironment.getConfig("arduino-builder-url")+"compile.php", true);
    xhr.send(
      JSON.stringify({
        data: this.data,
        board: this.fqbn,
        lang: Arduino.prototype.getMessage("lang")
      })
    );
  };

  /**
   * compile the code
   *
   * this.data must contain arduino's syntax code
   * this.fqbn can contain arduino's identifier (if not it will be asked in a popup)
   *
   * @see Arduino.prototype._compileCode
   */
  Arduino.prototype._compileOnly = function() {
    this._compileCode(false);
  };

  /**
   * compile and upload the code
   *
   * this.data must contain arduino's syntax code
   * this.fqbn can contain arduino's identifier (if not it will be asked in a popup)
   * this.port can contain arduino's port (if not it will be asked in a popup)
   *
   * @see Arduino.prototype._compileCode
   */
  Arduino.prototype._upload = function() {
    this._compileCode(true);
  };

  /**
   * return the card corresponding to the given pid and vid, false if not found
   *
   * Arduino.boardList must contain list of supported boards
   *
   * @param {string} pid
   * @param {string} vid
   *
   * @returns {boolean|array}
   */
  Arduino.prototype._getBoardInfo = function(pid, vid) {
    for (var boardId in Arduino.boardList) {
      var board = Arduino.boardList[boardId];

      if (board == null) continue;

      for (var i in board.vid) {
        if (board.vid[i] == vid && board.pid[i] == pid) {
          return board;
        }
      }
    }

    return false;
  };

  /**
   * set arduino code
   *
   * @param {string} data
   *
   * @returns {Arduino}
   */
  Arduino.prototype._setData = function(data) {
    this.data = data;
    return this;
  };

  /**
   * set connected board's port
   *
   * @param {string} port
   *
   * @returns {Arduino}
   */
  Arduino.prototype._setPort = function(port) {
    this.port = port;
    return this;
  };

  /**
   * set connected board's identifier
   *
   * @param {string} fqbn
   *
   * @returns {Arduino}
   */
  Arduino.prototype._setBoard = function(fqbn) {
    this.fqbn = fqbn;
    return this;
  };

  /**
   * if only one board is connected
   * set connected board's identifier and port
   * and return true
   * 
   * else return false
   *
   * @returns {boolean}
   */
  Arduino.prototype._autoSetBoard = function(){
    var serial = Arduino.daemon.devicesList.value.serial;

    if(serial.length == 1){
        this._setPort(serial[0].Name);
        this._setBoard(this._getBoardInfo(serial[0].ProductID, serial[0].VendorID).fqbn);
        return true;
    }
    else{
      return false;
    }
  };

  /**
   * get arduino code in the file
   *
   * @param {string} name name of the file
   */
  Arduino.prototype._import = function(name) {
    Arduino.syncMan.begin();
    Arduino.programName = name;
    var self = this;
    TLink.getProgramCode(name, function(data) {
      self.data = '#line 1 "' + Arduino.programName + '"\n' + data;
      Arduino.syncMan.end();
    });
  };

  /**
   * get Declick code in the file and convert it to arduino code
   *
   * @param {string} name name of the file
   */
  Arduino.prototype._importDeclick = function(name) {
    Arduino.syncMan.begin();
    var self = this;
    TLink.getProgramStatements(name, function(e) {
      var vars = new Map();
      var a = self._declickToArduino(e, vars);

      var declareVars = "";
      vars.forEach(function(val, key) {
        if (val.type == "Literal" && typeof val.value == "string"){
          declareVars += "String ";
          declareVars += key;
          declareVars += " = ";
          declareVars += self._declickToArduino(val);
          declareVars += ";\n";
        }
        else{
          declareVars += "auto ";
          declareVars += key;
          declareVars += " = ";
          declareVars += self._declickToArduino(val);
          declareVars += ";\n";
        }
        
      });

      var includes = "";

      self.modules.forEach(function(m) {
        includes += "#include <" + m + ">\n";
      });

      self.data = includes + declareVars + a;

      Arduino.syncMan.end();
    });
  };

  /**
   * get Declick code and convert it to arduino code
   * 
   * @param {string} name name of the file
   */
  Arduino.prototype._setDataDeclick = function(data) {
    var vars = new Map();
    var statements = TParser.parse(data)
    var a = this._declickToArduino(statements, vars);

    var declareVars = "";
    var self = this;
    vars.forEach(function(val, key) {
      if (val.type == "Literal" && typeof val.value == "string"){
        declareVars += "String ";
        declareVars += key;
        declareVars += " = ";
        declareVars += self._declickToArduino(val);
        declareVars += ";\n";
      }
      else{
        declareVars += "auto ";
        declareVars += key;
        declareVars += " = ";
        declareVars += self._declickToArduino(val);
        declareVars += ";\n";
      }
      
    });

    var includes = "";

    this.modules.forEach(function(m) {
      includes += "#include <" + m + ">\n";
    });

    this.data = includes + declareVars + a;
  };

  /**
   * show a popup to select arduino's board
   *
   * if upload is true, compile and upload code
   * else just compile
   *
   * Arduino.syncMan must contain a SyncronousManager
   * Arduino.boardSelector must be initialised
   *
   * @see Arduino.prototype._compileCode
   *
   * @param {boolean} upload
   */
  Arduino.prototype._askBoard = function(upload) {
    Arduino.syncMan.begin();

    var button = $("#tcanvas-popup-button");
    var content = $("#tcanvas-popup-content");
    var popup = $("#tcanvas-popup");

    Arduino.previousPopup = {
      content: content.html(),
      button: button.clone(true),
      css: {
        width: popup.css("width"),
        "margin-left": popup.css("margin-left"),
        "text-align": popup.css("text-align")
      }
    };

    popup.css("width", "450px");
    popup.css("margin-left", "-225px");
    popup.css("text-align", "center");
    var self = this;
    button.click(function() {
      if ($("#arduinoSelectBoard").val() != "other") {
        var select = JSON.parse($("#arduinoSelectBoard").val());
        self.fqbn = select["board"];
        self.port = select["port"];
      } else {
        self.fqbn = $("#arduinoSelectOtherBoard").val();
      }

      var popup = $("#tcanvas-popup");

      for (prop in Arduino.previousPopup.css) {
        popup.css(prop, Arduino.previousPopup.css[prop]);
      }

      $("#tcanvas-popup-button").replaceWith(Arduino.previousPopup.button);
      $("#tcanvas-popup-content").html(Arduino.previousPopup.content);

      delete Arduino.previousPopup;

      self._compileCode(upload);
    });
    content.html(Arduino.boardSelector);
    content.change(Arduino.prototype._updateSelectBoard);
    Arduino.prototype._updateSelectBoard();
    popup.show();
  };

  /**
   * return initialised content for Arduino.boardSelector
   *
   * @returns {Node}
   */
  Arduino.prototype._initBoardSelector = function() {
    return $("<div></div>", {
      html: [
        $("<select></select>", {
          id: "arduinoSelectBoard",
          html: $()
        }),
        $("<br/>", {}),
        $("<select></select>", {
          id: "arduinoSelectOtherBoard",
          style: "display:none"
        })
      ]
    });
  };

  /**
   * show or hide $(#arduinoSelectOtherBoard") depending of $("#arduinoSelectBoard")
   */
  Arduino.prototype._updateSelectBoard = function() {
    if ($("#arduinoSelectBoard").val() == "other") {
      $("#arduinoSelectOtherBoard").css("display", "");
    } else {
      $("#arduinoSelectOtherBoard").css("display", "none");
    }
  };

  /**
   * open serial port (this.port) to comunicate with it
   */
  Arduino.prototype._openSerial = function(){
    Arduino.daemon.openSerialMonitor(this.port);
  }

  /**
   * send message to serialPort
   * 
   * @message {string}
   */
  Arduino.prototype._sendMessage = function(message){
    if (!message.endsWith('\n')){
      message += '\n';
    }
    
    Arduino.daemon.writeSerial(this.port, message);
  }

  /**
   * get first message terminated by "\r\n"
   * 
   * @returns {string}
   */
  Arduino.prototype._receiveMessage = function(){
    var res = Arduino.daemon.messageBuffer.match(/([\w\W]*?)\r\n([\w\W]*)/);
    
    if (res !== null){
      Arduino.daemon.messageBuffer = res[2];
      return res[1];
    }
    else{
      return "";
    }
  }

  /**
   * clear messageBuffer
   */
  Arduino.prototype._clearMessageList = function(){
    Arduino.daemon.messageBuffer = "";
  }

  /**
   * close serial port
   */
  Arduino.prototype._closeSerial = function(){
      Arduino.daemon.closeSerialMonitor(this.port);
  }

  /**
   * get status of last compilation
   * 
   * @returns {boolean}
   */
  Arduino.prototype._getCompileStatus = function(){
    return Arduino.compileStatus;
  }

  /**
   * get status of last upload
   * 
   * @returns {boolean}
   */
  Arduino.prototype._getUploadStatus = function(){
    return Arduino.uploadStatus;
  }

  /**
   * delete this
   */
  Arduino.prototype.deleteObject = function() {
    if (Arduino.previousPopup !== undefined) {
      var popup = $("#tcanvas-popup");

      for (prop in Arduino.previousPopup.css) {
        popup.css(prop, Arduino.previousPopup.css[prop]);
      }

      $("#tcanvas-popup-button").replaceWith(Arduino.previousPopup.button);
      $("#tcanvas-popup-content").html(Arduino.previousPopup.content);

      delete Arduino.previousPopup;
    }
    TObject.prototype.deleteObject.call(this);
  };

  Arduino.prototype._enableLogs = function(status) {
    if(status === true){
      toggleLogButton.style.display = 'initial'
    } else {
      toggleLogButton.style.display = 'none'      
    }
  };

  /*
  * create toggle btn log box
  *
  * */
  Arduino.prototype._createLoggerToggle = function() {
    var toggleLogButton = document.createElement('div')
    toggleLogButton.id = 'toggleLogButton'
    // style change if logs enable

    tcanvas_container.appendChild(toggleLogButton)
    toggleLogButton.style.display = 'none'

    toggleLogButton.addEventListener('click', function(){
      
      var goHiden = arduinoLogger.classList.toggle("hide-log")

      if(goHiden === true) {
        setTimeout(function() { arduinoLogger.style.display = 'none'},500)
      } else {
        arduinoLogger.style.display = 'initial'
      }
    })
  }

    // toggleLogButton.addEventListener('click', function(){
    //   if(arduinoLogger.classList.toggle("display-none")){

    //     arduinoLogger.classList.toggle("display-none")
    //     arduinoLogger.classList.toggle("hide-log")
    //   }
    //   if(arduinoLogger.classList.toggle("hide-log")){
    //     setTimeout(function() {
    //       arduinoLogger.classList.toggle("display-none")

    //     },500)
    //   }
    // })
  /*
  * create log box
  *
  * */
  Arduino.prototype._createLogger = function() {
    var pre = document.getElementById("arduinoLogger")
    if(pre == null){

      pre = document.createElement('pre')
      pre.id = 'arduinoLogger'
      
      tcanvas_container.appendChild(pre)
      arduinoLogger.classList.add("hide-log")
      arduinoLogger.style.display = 'none'
    }
  }

  /*
  * handle log message
  *
  * */
  Arduino.prototype._addLogMessage = function(message) {

    console.log(typeof message);

    var samp = document.createElement('samp')
    samp.innerHTML = message
    arduinoLogger.scrollTo(0,arduinoLogger.scrollHeight);
    // if(arduinoLogger.childNodes.length > 14){
    //   arduinoLogger.removeChild(arduinoLogger.getElementsByTagName('samp')[0])
    // }
    arduinoLogger.appendChild(samp)
  }


  return Arduino;
});
