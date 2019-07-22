define(['jquery', 'TEnvironment', 'TObject', 'TUtils', 'TUI', 'TLink', 'objects/button/Button'], function($, TEnvironment, TObject, TUtils, TUI, TLink, Button) {
    /**
     * Defines Arduino, inherited from TObject.
     * Arduino is a remote control robot.
     * @exports Arduino
     */
    var Arduino = function() {
        TObject.call(this);

        this.data = null; //arduino code
        this.connectedBoards = [];
        this.port = null;
        this.fqbn = null;

        this.daemon = new ArdCreAgtDaemon('/builder');

        this.boardsList = {};


        var xhr = new XMLHttpRequest();

        xhr.arduino = this;


        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {

                this.arduino.boardsList = JSON.parse(this.responseText);

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

    Arduino.prototype._compileCode = function(upload){
        var xhr = new XMLHttpRequest();

        xhr.arduino = this;

        
        
        xhr.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {

            var res = JSON.parse(this.responseText);

            console.log(res);


            if (res["status"]){//compilation réussie
                console.log("succeedeed compilation");
                TUI.showMessage("compilation réussie");
                
                //compilationLog.innerHTML = res["stdout"].replace(/\n/g, "<br>").replace(/ /g,"&nbsp;");

                //if(upload) uploadSketch(res);

                this.arduino.compilationResult = res;

                if (upload){
                    var target = {port:this.arduino.port, board:this.arduino.fqbn};

                    var sketchName = "test";
                
                    var compilationResult = this.arduino.compilationResult;
                
                    var verbose = true;
                
                    this.arduino.daemon.uploadSerial(target, sketchName, compilationResult, verbose);

                }
            }
            else{//compilation échouée
                console.log("failed compilation");
                TUI.showErrorMessage("compilation échouée");
                TUI.showErrorMessage(res["stderr"]);
                //compilationLog.innerHTML = res["stderr"].replace(/\n/g, "<br>").replace(/ /g,"&nbsp;");
            }
            
            }
        };

        xhr.open('POST', "/builder/compile.php", true);
        xhr.send(JSON.stringify({"data":this.data,"board":this.fqbn}));

    };


    Arduino.prototype._compile = function() {
        this._compileCode(false);
    };


    Arduino.prototype._upload = function() {
        this._compileCode(true);
    };


    Arduino.prototype._setupArdCreAgtDaemon = function(){
        /*lors d'une MàJ de l'état de l'agent affiche son état dans agentStatus

        constantes globales :
        - agentStatus
        */
        this.daemon.agentFound.subscribe(status => {
            if (status){
                console.log("agent connecté");
            }
            else{
                console.log("agent non connecté");
            }
        });
        
        
        /*lors d'une MàJ de l'état du canal affiche son état dans channelStatus
        
        constantes globales :
        - channelStatus
        */
        this.daemon.channelOpenStatus.subscribe(status => {
            if (status){
                console.log("canal ouvert");
            }
            else{
                console.log("canal fermé");
            }
        });
        
        
        /*lors d'une erreur, affiche l'erreur dans la console
        */
        this.daemon.error.subscribe(err => {
            console.log(err);
        });
        
        
        /*lors d'une MàJ des cartes connectées, les ajoute à la liste déroulante selectBoard
        
        constantes globales :
        - selectBoard
        */
        this.daemon.devicesList.subscribe(({serial, network}) => {

            this.connectedBoards = [];

            for(var board of serial){
                this.connectedBoards.push(this._getBoardInfo(board.ProductID, board.VendorID));
 

            }

            console.log(this.connectedBoards);
        
        });
        
        
        
        
        // Upload progress
        this.daemon.uploading.subscribe(upload => {
            console.log(upload)
            //if ('msg' in upload) document.getElementById(uploadLogArea).innerHTML += upload["msg"] + "<br/>";
        });


        

    };
    
    Arduino.prototype._getBoardInfo = function (pid, vid){
        var i;
        
        for (var board of this.boardsList){
        
            if(board == null) continue;
        
            for (i in board.vid){
        
                if (board.vid[i]==vid && board.pid[i]==pid){
                    return board;
                }
            }
        }
        
        return false;
    };

    Arduino.prototype._listBoards = function(){
        return this.connectedBoards;
    };

    Arduino.prototype._setData = function(data){
        this.data = data;
        return this;
    };

    Arduino.prototype._setPort = function(port){
        this.port = port;
        return this;
    };

    Arduino.prototype._setBoard = function(fqbn){
        this.fqbn = fqbn;
        return this;
    };

    Arduino.prototype._import = function(name){
        TLink.getProgramCode(name, (e) => {console.log(e); this.data = e;});
        TLink.getProgramStatements(name, (e) => console.log(e));
    }

    Arduino.prototype._setup = function(fct){
        this.setup = fct;

        console.log(this);
    }

    Arduino.prototype._loop = function(fct){
        this.loop = fct;

        console.log(this);
    }


    Arduino.prototype._importDeclick = function(name){
        TLink.getProgramStatements(name, (e) => {
            var vars = new Map();
            var a = declickToArduino(e, vars);
            console.log(e);
            console.log(vars);

            var declareVars = "";
            console.log(vars.keys());
            vars.forEach((val, key)=>{
                declareVars += "auto ";
                declareVars += key;
                declareVars += " = ";
                declareVars += declickToArduino(val);
                declareVars += ";\n";
            });

            var includes = "#include \"declick.h\"\n";

            console.log(includes+declareVars+a);
            this.data=includes+declareVars+a;
        });
    }

















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
                throw node.type + " cannot be used with arduino";
                

            
            
            




















        }









        return arduinoCode;

    }
    
    return Arduino;
});