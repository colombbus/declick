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
        "jquery-ui": '../libs/jquery.ui-1.11.2',
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
        "json": "../libs/pem-task/json2.min",
        "TExerciseProject": "data/TExerciseProject",
        "TResource": "data/TResource",
        "js-interpreter": "../libs/js-interpreter/interpreter",
        "prism": "../libs/prism/prism",
        "introjs": "../libs/introjs/intro.min"
    },
    map: {
        "fileupload": {
            "jquery.ui.widget": 'jquery-ui/widget'
        }
    },
    shim: {
        'split-pane': {
            deps: ['jquery']
        },
        "ace/autocomplete": {
            deps: ["ace/ace"]
        },
        'prism': {
            exports: 'Prism'
        }
    }
});

function load() {
    require(['jquery', 'TEnvironment', 'TRuntime', 'ui/TScormLearnFrame'], function ($, TEnvironment, TRuntime, TScormLearnFrame) {
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
                frame = new TScormLearnFrame(function (component) {
                    $("body").append(component);
                    TEnvironment.log("*******************");
                    TEnvironment.log("* Initiating link *");
                    TEnvironment.log("*******************");
                    TEnvironment.log("********************");
                    TEnvironment.log("* Loading exercise *");
                    TEnvironment.log("********************");
                    var self = this;
                    $(document).ready(function () {
                        self.mounted();
                        TRuntime.init();
                        // trigger resize in order for canvas to update its size (and remove the 5px bottom margin)
                        $(window).resize();
                        self.load();
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
