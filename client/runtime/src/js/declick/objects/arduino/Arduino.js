define(['jquery', 'TEnvironment', 'TObject', 'TUtils', 'TUI', 'TLink'], function($, TEnvironment, TObject, TUtils, TUI, TLink) {
    /**
     * Defines Arduino, inherited from TObject.
     * Arduino is a remote control robot.
     * @exports Arduino
     */
    var Arduino = function() {
        TObject.call(this);

        this.data = null; //arduino code
        this.connectedBoards = [];
        this.hex = null; //compiled arduino code
        this.elf = null;
        this.port = null;
        this.port = null;
        this.port = null;

        this.daemon = new ArdCreAgtDaemon('https://guillermc.iiens.net/tests/rosa-arduino/comArduino/');

        this.boardsList = {};


        var xhr = new XMLHttpRequest();

        xhr.arduino = this;


        xhr.onreadystatechange = function(){
            if (this.readyState == 4 && this.status == 200) {

                this.arduino.boardsList = JSON.parse(this.responseText);

                this.arduino._setupArdCreAgtDaemon();

            }

        };


        xhr.open("GET", "https://guillermc.iiens.net/tests/rosa-arduino/comArduino/boards.php");
        xhr.send();


        TLink.getProgramStatements("nouveau 2", (e) => console.log(e));
    };


    Arduino.prototype = Object.create(TObject.prototype);
    Arduino.prototype.constructor = Arduino;
    Arduino.prototype.className = "Arduino";
    
    TObject

    Arduino.prototype._compile = function(){
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

                this.arduino.hex = res["hex"];
                this.arduino.elf = res["elf"];
            }
            else{//compilation échouée
                console.log("failed compilation");
                TUI.showErrorMessage("compilation échouée");
                TUI.showErrorMessage(res["stderr"]);
                //compilationLog.innerHTML = res["stderr"].replace(/\n/g, "<br>").replace(/ /g,"&nbsp;");
            }
            
            }
        };

        xhr.open('POST', "https://guillermc.iiens.net/tests/rosa-arduino/comArduino/compile.php", true);
        xhr.send(JSON.stringify({"data":this.data,"board":this.fqbn}));

    };


    Arduino.prototype._importFile = function() {

    };


    Arduino.prototype._upload = function() {
        var target = {port:this.port, fqbn:this.fqbn};

        var sketchName = "test";
    
        var compilationResult = this.hex;
    
        var verbose = true;
    
        this.daemon.uploadSerial(target, sketchName, compilationResult, verbose);
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

            for(var board in serial){
                this.connectedBoards.push(this._getBoardInfo(serial[board].ProductID, serial[board].VendorID));
 

            }

            console.log(this.connectedBoards);
        
        });
        
        
        
        
        // Upload progress
        this.daemon.uploading.subscribe(upload => {
            //if ('msg' in upload) document.getElementById(uploadLogArea).innerHTML += upload["msg"] + "<br/>";
        });


        

    };
    
    Arduino.prototype._getBoardInfo = function (pid, vid){
        var i;
        
        for (var board in this.boardsList){
        
            if(this.boardsList[board] == null) continue;
        
            for (i in this.boardsList[board].vid){
        
                if (this.boardsList[board].vid[i]==vid && this.boardsList[board].pid[i]==pid){
                    return this.boardsList[board];
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

    Arduino.prototype._setFile = function(file){
        this.file = file;
        return this;
    }
    
    return Arduino;
});