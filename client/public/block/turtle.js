Blockly.Blocks['declick_avancer'] = {
    init: function () {
        this.jsonInit({
            "message0": 'avancer',
            "nextStatement": null,
            "previousStatement": null,
            "colour": 160,
            "tooltip": "Faire avancer la tortue",
        });
    }
};

Blockly.JavaScript['declick_avancer'] = function (block) {
    return 'bob.avancer();\n';
};