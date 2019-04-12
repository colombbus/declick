// import declick from "../../../../ui/src/assets/config/declick";

require.config({
    "baseUrl": 'js/declick',
    paths: {
        "jquery": '../libs/jquery/jquery.min',
        "ace": '../libs/ace',
        "ace/autocomplete": '../libs/ace/ext-language_tools',
        "ace/range": '../libs/ace/ace',
        "babylon": '../libs/babylonjs/babylon',
        "split-pane": '../libs/split-pane/split-pane',
        "quintus": '../libs/quintus-0.2.0/quintus-all.min',
        "acorn": '../libs/acorn/acorn',
        "TObject": 'objects/tobject/TObject',
        "TObject3D": 'objects/tobject3d/TObject3D',
        "TGraphicalObject": 'objects/tgraphicalobject/TGraphicalObject',
        "fileupload": '../libs/jquery-file-upload/jquery.fileupload',
        "iframe-transport": '../libs/jquery-file-upload/jquery.iframe-transport',
        "jquery-ui": '../libs/jquery.ui-1.11.2',
        "wPaint": '../libs/wpaint-2.5.0/wPaint.min',
        "wColorPicker": '../libs/wpaint-2.5.0/wColorPicker.min',
        "wPaint/plugins/file": '../libs/wpaint-2.5.0/plugins/file/wPaint.menu.main.file.min',
        "wPaint/plugins/main": '../libs/wpaint-2.5.0/plugins/main/wPaint.menu.main.min',
        "wPaint/plugins/shapes": '../libs/wpaint-2.5.0/plugins/shapes/wPaint.menu.main.shapes.min',
        "wPaint/plugins/text": '../libs/wpaint-2.5.0/plugins/text/wPaint.menu.text.min',
        "wPaint/plugins/flip": 'plugins/wPaint.menu.main.flip',
        "TProject": "data/TProject",
        "TProgram": "data/TProgram",
        "TEnvironment": "env/TEnvironment",
        "TLink": "env/TLink",
        "TI18n": "env/TI18n",
        "TInterpreter": "run/TInterpreter",
        "TParser": "run/TParser",
        "TRuntime": "run/TRuntime",
        "TGraphics": "run/TGraphics",
        "TUI": "ui/TUI",
        "CommandManager": "utils/CommandManager",
        "ResourceManager": "utils/ResourceManager",
        "SynchronousManager": "utils/SynchronousManager",
        "TError": "utils/TError",
        "TUtils": "utils/TUtils",
        "TResource": "data/TResource",
        "platform-pr": "../libs/pem-task/platform-pr",
        "jschannel": "../libs/jschannel/jschannel",
        "json": "../libs/pem-task/json2.min",
        "Task": "env/Task",
        "Grader": "env/Grader",
        "TExerciseProject": "data/TExerciseProject",
        "js-interpreter": "../libs/js-interpreter/interpreter",
        "introjs": "../libs/introjs/intro.min",
        "prism":"../libs/prism/prism",
    },
    map: {
        "fileupload": {
            "jquery.ui.widget": 'jquery-ui/widget'
        }
    },
    shim: {
        "jquery-ui": {
            exports: "$",
            deps: ['jquery']
        },
        'wPaint': {
            deps: ['jquery', 'jquery-ui/core', 'jquery-ui/widget', 'jquery-ui/draggable', 'jquery-ui/mouse']
        },
        'wPaint/plugins/main': {
            deps: ['wPaint']
        },
        'wPaint/plugins/file': {
            deps: ['wPaint', 'wPaint/plugins/main']
        },
        'wPaint/plugins/shapes': {
            deps: ['wPaint', 'wPaint/plugins/main']
        },
        'wPaint/plugins/text': {
            deps: ['wPaint', 'wPaint/plugins/main']
        },
        'wPaint/plugins/flip': {
            deps: ['wPaint', 'wPaint/plugins/main']
        },
        'wColorPicker': {
            deps: ['wPaint']
        },
        'split-pane': {
            deps: ['jquery']
        },
        'platform-pr': {
            deps: ['jquery', 'jschannel'],
            exports: '$'
        },
        "ace/autocomplete": {
            deps: ["ace/ace"]
        },
        'prism': {
            exports: 'Prism'
        }
    }
});

//window.location.protocol + "//" + window.location.host+ window.location.pathname.split("/").slice(0, -1).join("/")+"/js/declick",
//baseUrl: 'js/declick',
// Start the main app logic.
function load() {
    require(['jquery', 'TEnvironment', 'TRuntime', 'ui/TFrame', 'TProject'], function ($, TEnvironment, TRuntime, TFrame, TProject) {
        window.console.log("*******************");
        window.console.log("* Loading Environment *");
        window.console.log("*******************");
        TEnvironment.load(function () {
            TEnvironment.log("*******************");
            TEnvironment.log("* Loading Runtime *");
            TEnvironment.log("*******************");
            TRuntime.load(function () {
                TEnvironment.log("***************************");
                TEnvironment.log("* Building User Interface *");
                TEnvironment.log("***************************");
                frame = new TFrame(function (component) {
                    const nodeName = $("script[src='js/libs/requirejs/require.js']").attr("data-entry")
                    const declickNode = document.createElement("div") 
                    declickNode.setAttribute('class', nodeName)
                    $("body").append(declickNode)
                    // Create with jQuery
                    // $(`.${nodeName}`).append(component);
                    $("body").append(component)

                    TEnvironment.log("*******************");
                    TEnvironment.log("* Initiating link *");
                    TEnvironment.log("*******************");
                    var currentProject = new TProject();
                    currentProject.init(function () {
                        TEnvironment.setProject(currentProject);
                        $(document).ready(function () {
                            frame.mounted();
                            TRuntime.init();
                            if (typeof window.parent !== 'undefined') {
                                window.parent.postMessage('init', '*');
                            }
                        });
                    });
                });
            });
        });
    });
}

var loading = new Image();
loading.src = "images/loader2.gif";
if (loading.complete) {
    load();
} else {
    loading.onload = load();
}
