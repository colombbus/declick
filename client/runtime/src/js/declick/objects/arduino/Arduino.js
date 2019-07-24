define(['jquery', 'TObject', 'TUI', 'TLink', 'SynchronousManager', 'TError', 'TRuntime'], function($, TObject, TUI, TLink, SyncMan, TError, TRuntime) {
    /**
     * Defines Arduino, inherited from TObject.
     * It's an object used to communicate and transfert code to an arduino board
     * @exports Arduino 
     */
    var Arduino = function() {
        TObject.call(this);

        this.boardSelector = this._initBoardSelector();

        this.modules = ["declick.h"]; //modules used for compilation

        this.syncMan = new SyncMan();

        this.data = null; //arduino code
        this.connectedBoards = [];
        this.port = null; //port on which the arduino board is connected
        this.fqbn = null; //board's idenfifier

        this.daemon = new ArdCreAgtDaemon('/builder');

        this.boardsList = {};

        //getting list of arduino boards
        var xhr = new XMLHttpRequest();

        xhr.arduino = this;

        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {

                this.arduino.boardsList = JSON.parse(this.responseText);

                this.arduino.boardSelector.children("#arduinoSelectOtherBoard").empty();

                for (var board in this.arduino.boardsList){
                    if (this.arduino.boardsList[board] != null)
                        this.arduino.boardSelector.children("#arduinoSelectOtherBoard").append("<option value='"+board+"'>"+this.arduino.boardsList[board].name+"</option>");
                }

                this.arduino._setupArdCreAgtDaemon();

            }

        };

        xhr.open("GET", "/builder/boards.php");
        xhr.send();

    };


    Arduino.prototype = Object.create(TObject.prototype);
    Arduino.prototype.constructor = Arduino;
    Arduino.prototype.className = "Arduino";
    
    TObject

    /**
     * compile code through an server
     * if upload is true upload the compiled code on the arduino board
     * @param {boolean} upload
     */
    Arduino.prototype._compileCode = function(upload){
        if(!this.fqbn || (upload && !this.port)){
            this._askBoard(upload);
            return;
        }


        var xhr = new XMLHttpRequest();

        xhr.arduino = this;
        
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

            var res = JSON.parse(this.responseText);

            if (res["status"]){//compilation succedeed
                TUI.addLogMessage(Arduino.prototype.getMessage("compilationSuccess"));

                if (upload){
                    var target = {port:this.arduino.port, board:this.arduino.fqbn};

                    var sketchName = "test";
                
                    var compilationResult = res;
                
                    var verbose = true;
                
                    this.arduino.daemon.uploadSerial(target, sketchName, compilationResult, verbose);

                }
            }
            else{//compilation failed
                TUI.addLogError(Error(Arduino.prototype.getMessage("compilationFail")));

                
                res["stderr"].split("\n").forEach(msg => {
                    TUI.addLogError(Error(msg.replace(/ /g, "\u00a0")));
                });
                
            }
            
            }
        };

        xhr.open('POST', "/builder/compile.php", true);
        xhr.send(JSON.stringify({"data":this.data,"board":this.fqbn}));

    };

    /**
     * compile the code
     * @see _compileCode
     */
    Arduino.prototype._compileOnly = function() {
        this._compileCode(false);
    };

    /**
     * compile and upload the code
     * @see _compileCode
     */
    Arduino.prototype._upload = function() {
        this._compileCode(true);
    };

    /**
     * configure daemon's behaviour
     */
    Arduino.prototype._setupArdCreAgtDaemon = function(){
        
        this.daemon.agentFound.subscribe(status => {
            if (status){
                TUI.addLogMessage(Arduino.prototype.getMessage("agentCo"));
            }
            else{
                TUI.addLogMessage(Arduino.prototype.getMessage("agentNotCo"));
            }
        });
        
        
        
        this.daemon.channelOpenStatus.subscribe(status => {
            if (status){
                TUI.addLogMessage(Arduino.prototype.getMessage("channelOpen"));
            }
            else{
                TUI.addLogMessage(Arduino.prototype.getMessage("channelClose"));
            }
        });
        
        
        
        this.daemon.error.subscribe(err => {
            if (err !== null){
                console.log(err);
                TUI.addLogError(Error(err));
            }
        });
        
        
        
        this.daemon.devicesList.subscribe(({serial, network}) => {

            this.connectedBoards = [];

            this.boardSelector.children("#arduinoSelectBoard").empty();

            for(var board of serial){
                this.connectedBoards.push(this._getBoardInfo(board.ProductID, board.VendorID));

                var boardInfo = this._getBoardInfo(board.ProductID, board.VendorID);
                this.boardSelector.children("#arduinoSelectBoard").append("<option value='"+JSON.stringify({board:boardInfo.fqbn, port:board.Name})+"' >"+boardInfo.name+" sur "+board.Name+"</option>");

            }

            this.boardSelector.children("#arduinoSelectBoard").append("<option value='other'>other</option>");

            this._updateSelectBoard();

            console.log(this.connectedBoards);
            TUI.addLogMessage(this.connectedBoards);
        
        });
        
        
        
        
        // Upload progress
        this.daemon.uploading.subscribe(upload => {
            console.log(upload)
            if (upload.status == 'UPLOAD_IN_PROGRESS') TUI.addLogMessage(upload.msg);
            else if (upload.status == 'UPLOAD_DONE') TUI.addLogMessage(Arduino.prototype.getMessage("uploadSuccess"));
            else if (upload.status == 'UPLOAD_ERROR') TUI.addLogError(Error(Arduino.prototype.getMessage("uploadFail")));
        });


        

    };
    
    /**
     * return the card corresponding to the given pid and vid
     * @param {string} pid
     * @param {string} vid
     */
    Arduino.prototype._getBoardInfo = function (pid, vid){
        var i;
        
        for (var boardId in this.boardsList){

            var board = this.boardsList[boardId];
        
            if(board == null) continue;
        
            for (i in board.vid){
        
                if (board.vid[i]==vid && board.pid[i]==pid){
                    return board;
                }
            }
        }
        
        return false;
    };

    /**
     * return connected Boards
     */
    Arduino.prototype._listBoards = function(){
        return this.connectedBoards;
    };

    /**
     * set arduino code
     * @param {string} data
     */
    Arduino.prototype._setData = function(data){
        this.data = data;
        return this;
    };

    /**
     * set connected board's port
     * @param {string} port
     */
    Arduino.prototype._setPort = function(port){
        this.port = port;
        return this;
    };

    /**
     * set connected board's identifier
     * @param {string} fqbn
     */
    Arduino.prototype._setBoard = function(fqbn){
        this.fqbn = fqbn;
        return this;
    };

    /**
     * get arduino code in the file
     * @param {string} name name of the file
     */
    Arduino.prototype._import = function(name){
        TLink.getProgramCode(name, (e) => {console.log(e); this.data = e;});
    }

    /**
     * get Declick code in the file and convert it to arduino code
     * @param {string} name name of the file
     */
    Arduino.prototype._importDeclick = function(name){
        this.syncMan.begin();
        TLink.getProgramStatements(name, (e) => {
            var vars = new Map();
            var a = declickToArduino(e, vars);

            var declareVars = "";
            vars.forEach((val, key)=>{
                declareVars += "auto ";
                declareVars += key;
                declareVars += " = ";
                declareVars += declickToArduino(val);
                declareVars += ";\n";
            });

            var includes = "";

            this.modules.forEach(m=>{
                includes += '#include "'+m+'"\n';
            })

            console.log(includes+declareVars+a);
            this.data=includes+declareVars+a;

            this.syncMan.end();
        });
    }

    Arduino.prototype._askBoard = function(upload){

        this.syncMan.begin();

        var button = $("#tcanvas-popup-button");
        var content = $("#tcanvas-popup-content");
        var popup = $("#tcanvas-popup");

        //this.previousPopupCss = popup.css();

        popup.css("width","450");
        popup.css("margin-left", '-225px');
        popup.css("text-align", "center");

        //button.text("select");
        button.click(()=>{
            if($("#arduinoSelectBoard").val()!='other'){
                var select = JSON.parse($("#arduinoSelectBoard").val());
                this.fqbn=select["board"];
                this.port=select["port"];
            }
            this.syncMan.end();
            this._compileCode(upload);
        });
        content.empty();
        content.append(this.boardSelector);
        content.change(this._updateSelectBoard);
        popup.show();

    }

    Arduino.prototype._initBoardSelector = function(){
        


        return $("<div></div>", {
            html:[
                $("<select></select>", {
                    id:"arduinoSelectBoard",
                    html:$()                    
                }),
                $("<br/>", {}),
                $("<select></select>", {
                    id:"arduinoSelectOtherBoard",
                    style:"display:none"
                })]  
        });

    }


    Arduino.prototype._updateSelectBoard = function(){
        if ($("#arduinoSelectBoard").val()=='other'){
            $("#arduinoSelectOtherBoard").css("display", "");
        }
        else{
            $("#arduinoSelectOtherBoard").css("display", "none");
        }
    }

    Arduino.prototype.deleteObject = function() {
        console.log("rip");
        this.syncMan.begin();

        if (true) {
            var popup = $("#tcanvas-popup");

            popup.css("width","250");
            popup.css("margin-left", '-125px');
            popup.css("text-align", "");
        }
        this.syncMan.end();
        TRuntime.removeObject(this);
        
    };













    /**
     * convert declick code to arduino code
     * @param node : code's statements
     * @param vars : declared vars in the setup function
     * @param parentFonction : name of the parent function
     */
    declickToArduino = function(node, vars=new Map(), parentFonction=null){
        var arduinoCode = "";

        if (node === null){
            return "";
        }

        switch (node.type){
            case 'Program':
                arduinoCode = "";
                for (var statement of node.body){
                    arduinoCode += declickToArduino(statement, vars, parentFonction);
                    arduinoCode += ";\n";
                }
                break;

            case 'BreakStatement':
                arduinoCode = "break";
                break;

            case 'ContinueStatement':
                arduinoCode = "continue";
                break;

            case 'DoWhileStatement':
                arduinoCode = "do\n";
                arduinoCode += declickToArduino(node.body, vars, parentFonction);
                arduinoCode += "while(";
                arduinoCode += declickToArduino(node.test, vars, parentFonction);
                arduinoCode += ")";
                break;

            case 'IfStatement':
                arduinoCode = "if(";
                arduinoCode += declickToArduino(node.test, vars, parentFonction);
                arduinoCode += ")\n";
                arduinoCode += declickToArduino(node.consequent, vars, parentFonction);
                if (node.alternate !== null){
                    arduinoCode += "else\n";
                    arduinoCode += declickToArduino(node.alternate, vars, parentFonction);
                }
                break;

            case 'ReturnStatement':
                arduinoCode = "return(";
                arduinoCode += declickToArduino(node.argument, vars, parentFonction);
                arduinoCode += ")";
                break;

            case 'SwitchStatement':
                arduinoCode = "switch(";
                arduinoCode += declickToArduino(node.discriminant, vars, parentFonction);
                arduinoCode += ") {\n";
                for (var caseStatement of node.cases){
                    arduinoCode += declickToArduino(caseStatement, vars, parentFonction);
                }
                arduinoCode += "}";
                break;

            case 'SwitchCase':
                if (node.test !== null){
                    arduinoCode = "case (";
                    arduinoCode += declickToArduino(node.test, vars, parentFonction);
                    arduinoCode += "):\n";
                }
                else{
                    arduinoCode = "default :\n"
                }
                for (var statement of node.consequent){
                    arduinoCode += declickToArduino(statement, vars, parentFonction);
                    arduinoCode += ";\n";
                }
                break;

            case 'WhileStatement':
                arduinoCode = "while(";
                arduinoCode += declickToArduino(node.test, vars, parentFonction);
                arduinoCode += ")\n";
                arduinoCode += declickToArduino(node.body, vars, parentFonction);
                break;

            case 'EmptyStatement':
                arduinoCode = "";
                break;

            case 'ExpressionStatement':
                arduinoCode = declickToArduino(node.expression, vars, parentFonction);
                break;

            case 'BlockStatement':
                arduinoCode = "{\n";
                for (var statement of node.body){
                    arduinoCode += declickToArduino(statement, vars, parentFonction);
                    arduinoCode += ";\n";
                }
                arduinoCode += "}";
                break;

            case 'ForStatement':
                arduinoCode = "for (";
                arduinoCode += declickToArduino(node.init, vars, parentFonction);
                arduinoCode += "; ";
                arduinoCode += declickToArduino(node.test, vars, parentFonction);
                arduinoCode += "; ";
                arduinoCode += declickToArduino(node.update, vars, parentFonction);
                arduinoCode += ")\n";
                arduinoCode += declickToArduino(node.body, vars, parentFonction);
                break;

            case 'RepeatStatement':
                if (node.count === null){
                    arduinoCode = "while (true)\n";
                }
                else{
                    do{
                        var rand = 'i_'+Math.random().toString(36).replace('0.', '');
                    }while (node.raw.indexOf(rand)!=-1);

                    arduinoCode = "for (int "+rand+"=0; "+rand+"<";
                    arduinoCode += declickToArduino(node.count, vars, parentFonction);
                    arduinoCode += "; ++"+rand + ")\n";
                }
                arduinoCode += declickToArduino(node.body, vars, parentFonction);
                break;

            case 'AssignmentExpression':
                if(parentFonction=='setup' && node.left.type=='Identifier'){
                    vars.set(node.left.name, node.right);
                }
                arduinoCode = declickToArduino(node.left, vars, parentFonction);
                arduinoCode += " ";
                arduinoCode += node.operator;
                arduinoCode += " (";
                arduinoCode += declickToArduino(node.right, vars, parentFonction);
                arduinoCode += ")";
                break;

            case 'ConditionalExpression':
                arduinoCode = "(";
                arduinoCode += declickToArduino(node.test, vars, parentFonction);
                arduinoCode += ") ? (";
                arduinoCode += declickToArduino(node.consequent, vars, parentFonction);
                arduinoCode += ") : (";
                arduinoCode += declickToArduino(node.alternate, vars, parentFonction);
                arduinoCode += ")";
                break;
            
            case 'LogicalExpression':
                arduinoCode = "(";
                arduinoCode += declickToArduino(node.left, vars, parentFonction);
                arduinoCode += ") ";
                arduinoCode += node.operator;
                arduinoCode += " (";
                arduinoCode += declickToArduino(node.right, vars, parentFonction);
                arduinoCode += ")";
                break;

            case 'BinaryExpression':
                arduinoCode = "(";
                arduinoCode += declickToArduino(node.left, vars, parentFonction);
                arduinoCode += ") ";
                arduinoCode += node.operator;
                arduinoCode += " (";
                arduinoCode += declickToArduino(node.right, vars, parentFonction);
                arduinoCode += ")";
                break;

            case 'UpdateExpression':
                vars
                if (node.prefix){
                    arduinoCode = "(";
                    arduinoCode += declickToArduino(node.argument, vars, parentFonction);
                    arduinoCode += ") ";
                    arduinoCode += node.operator;
                }
                else{
                    arduinoCode = node.operator;
                    arduinoCode += " (";
                    arduinoCode += declickToArduino(node.argument, vars, parentFonction);
                    arduinoCode += ")";
                }
                break;

            case 'UnaryExpression':
                if (node.prefix){
                    arduinoCode = "(";
                    arduinoCode += declickToArduino(node.argument, vars, parentFonction);
                    arduinoCode += ") ";
                    arduinoCode += node.operator;
                }
                else{
                    arduinoCode = node.operator;
                    arduinoCode += " (";
                    arduinoCode += declickToArduino(node.argument, vars, parentFonction);
                    arduinoCode += ")";
                }
                break;

            case 'MemberExpression':
                arduinoCode = "(";
                arduinoCode += declickToArduino(node.object, vars, parentFonction);
                arduinoCode += ")";
                if (node.computed === true){
                    arduinoCode += "[";
                    arduinoCode += declickToArduino(node.property, vars, parentFonction);
                    arduinoCode += "]";
                }
                else{
                    arduinoCode += ".";
                    arduinoCode += declickToArduino(node.property, vars, parentFonction);
                }
                break;

            case 'CallExpression':
                arduinoCode = declickToArduino(node.callee, vars, parentFonction);
                arduinoCode += "(";
                for (var arg in node.arguments) {
                    if (arg !== '0'){
                        arduinoCode += ", ";
                    }
                    arduinoCode += "(";
                    arduinoCode += declickToArduino(node.arguments[arg], vars, parentFonction);
                    arduinoCode += ")";
                }
                arduinoCode += ")";
                break;

            case 'ThisExpression':
                arduinoCode = "this";
                break;

            case 'NewExpression':
                arduinoCode = declickToArduino(node.callee, vars, parentFonction);
                arduinoCode += "(";
                for (var arg in node.arguments) {
                    if (arg !== '0'){
                        arduinoCode += ", ";
                    }
                    arduinoCode += "(";
                    arduinoCode += declickToArduino(node.arguments[arg], vars, parentFonction);
                    arduinoCode += ")";
                }
                arduinoCode += ")";
                break;

            case 'Identifier':
                arduinoCode = node.name;
                break;
            
            case 'Literal':
                arduinoCode = String(node.value);
                break;

            case 'FunctionDeclaration':
                parentFonction = node.id.name;
                if (parentFonction === Arduino.prototype.getMessage('setupFunction')){
                    parentFonction = "setup";
                }
                else if (parentFonction === Arduino.prototype.getMessage('loopFunction')){
                    parentFonction = "loop";
                }
                if(parentFonction=='setup' || parentFonction=='loop'){
                    arduinoCode = "void ";
                    arduinoCode += parentFonction;
                    arduinoCode += "(";
                }
                else{
                    arduinoCode = "template<class myTypeReturn";
                    for (var param in node.params) {
                        arduinoCode += ", ";
                        arduinoCode += "class myType";
                        arduinoCode += param;
                    }
                    arduinoCode += ">\nmyTypeReturn ";
                    arduinoCode += declickToArduino(node.id, vars, parentFonction);
                    arduinoCode += " (";
                    for (var param in node.params) {
                        if (param !== '0'){
                            arduinoCode += ", ";
                        }
                        arduinoCode += "myType";
                        arduinoCode += param;
                        arduinoCode += " ";
                        arduinoCode += declickToArduino(node.params[param], vars, parentFonction);
                    }
                }
                arduinoCode += ")\n";
                arduinoCode += declickToArduino(node.body, vars, parentFonction);
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

    }
    
    return Arduino;
});