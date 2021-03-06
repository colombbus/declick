define(['jquery', 'TEnvironment', 'TGraphicalObject', 'objects/sprite/Sprite', 'objects/walker/Walker', 'TUtils'], function ($, TEnvironment, TGraphicalObject, Sprite, Walker, TUtils) {
    /**
     * Defines Character, inherited from Walker.
     * It has predefined appearances, is animated when it moves,
     * can walk in a Scene and catch objects.
     * @param {String} name Character's name
     * @exports Character
     */
    var Character = function (name) {
        Walker.call(this);
        if (typeof (name) === 'undefined') {
            name = "tangy";
        }
        this.translatedDownward = this.getMessage("downward");
        this.translatedUpward = this.getMessage("upward");
        this.translatedForward = this.getMessage("forward");
        this.translatedBackward = this.getMessage("backward");
        this.translatedFront = this.getMessage("front");
        this.custom = false;
        this.aspectName = "";
        this._setAspect(name);

    };
    // TODO: use Quintus animations

    Character.prototype = Object.create(Walker.prototype);
    Character.prototype.constructor = Character;
    Character.prototype.className = "Character";

    var graphics = Character.prototype.graphics;

    Character.prototype.gClass = graphics.addClass("TWalker", "TCharacter", {
        init: function (props, defaultProps) {
            this._super(TUtils.extend({
                dtMovement: 1,
                dtPause: 1,
                imgIndex: 0,
                lastX: 0,
                lastMove: Character.DIRECTION_NONE,
                frontAssetsCount: 0,
                downwardAssetsCount: 0,
                upwardAssetsCount: 0,
                forwardAssetsCount: 0,
                backwardAssetsCount: 0,
                defaultAssetsCount: 0,
                durationMove: 1,
                durationPause: 1,
                ellapsed: 0.0,
                autoAsset: true,
                sizeSet: false
            }, props), defaultProps);
            this.frontAssets = [];
            this.downwardAssets = [];
            this.upwardAssets = [];
            this.forwardAssets = [];
            this.backwardAssets = [];
            this.defaultAssets = [];
            this.assetOperations = [];
            this.moves = [];
            this.catchableObjects = {};
            this.on("stop", "nextMove");
        },
        step: function (dt) {
            this._super(dt);
            var p = this.p;
            this.performAssetOperations();
            var step = 0;
            dt += p.ellapsed;
            var deltaX = p.x - p.lastX;
            var deltaY = p.y - p.lastY;
            var axisRatio;
            if (deltaY !== 0) {
                axisRatio = Math.abs(deltaX) / Math.abs(deltaY);
            } else {
                axisRatio = 1 / (Math.abs(deltaY) / Math.abs(deltaX));
            }
            if ((axisRatio > 0.99) && (axisRatio < 1.01)) {
                axisRatio = 1.01;
            }
            var useFrontAssets = false;
            if (p.autoAsset && !p.dragging && !p.frozen) {
                if (p.moving) {
                    // we are moving
                    if(axisRatio > 1) {
                        // X movement is dominant over Y movement
                        /*
                        if (dt > p.dtMovement) {
                        */
                            step = Math.floor(dt / p.dtMovement);
                            p.ellapsed = dt - step * p.dtMovement;
                            // display next image
                            if (deltaX > 0) {
                                // moving right
                                if (p.forwardAssetsCount > 0) {
                                    if (p.lastMove === Sprite.DIRECTION_RIGHT) {
                                        p.imgIndex = (p.imgIndex + step) % p.forwardAssetsCount;
                                    } else {
                                        // direction changed
                                        p.imgIndex = 0;
                                    }
                                    p.asset = this.forwardAssets[p.imgIndex];
                                    p.lastMove = Sprite.DIRECTION_RIGHT;
                                } else if (p.defaultAssetsCount > 0) {
                                    p.imgIndex = (p.imgIndex + step) % p.defaultAssetsCount;
                                    p.asset = this.defaultAssets[p.imgIndex];
                                }
                            } else {
                                // moving left
                                if (p.backwardAssetsCount > 0) {
                                    if (p.lastMove === Sprite.DIRECTION_LEFT) {
                                        p.imgIndex = (p.imgIndex + step) % p.backwardAssetsCount;
                                    } else {
                                        // direction changed
                                        p.imgIndex = 0;
                                    }
                                    p.asset = this.backwardAssets[p.imgIndex];
                                    p.lastMove = Sprite.DIRECTION_LEFT;
                                } else if (p.defaultAssetsCount > 0) {
                                    p.imgIndex = (p.imgIndex + step) % p.defaultAssetsCount;
                                    p.asset = this.defaultAssets[p.imgIndex];
                                }
                            }
                        /*
                        } else {
                            p.ellapsed = dt;
                        }
                        */
                    } else {
                        // Y movement is dominant over X movement
                        /*
                        if (dt > p.dtMovement) {
                        */
                            step = Math.floor(dt / p.dtMovement);
                            p.ellapsed = dt - step * p.dtMovement;
                            // display next image
                            if (deltaY > 0) {
                                // moving down
                                if (p.downwardAssetsCount > 0) {
                                    if (p.lastMove === Sprite.DIRECTION_DOWN) {
                                        p.imgIndex = (p.imgIndex + step) % p.downwardAssetsCount;
                                    } else {
                                        // direction changed
                                        p.imgIndex = 0;
                                    }
                                    p.asset = this.downwardAssets[p.imgIndex];
                                    p.lastMove = Sprite.DIRECTION_DOWN;
                                } else if (p.defaultAssetsCount > 0) {
                                    p.imgIndex = (p.imgIndex + step) % p.defaultAssetsCount;
                                    p.asset = this.defaultAssets[p.imgIndex];
                                } else {
                                    useFrontAssets = true;
                                }
                            } else {
                                if (p.upwardAssetsCount > 0) {
                                    if (p.lastMove === Sprite.DIRECTION_UP) {
                                        p.imgIndex = (p.imgIndex + step) % p.upwardAssetsCount;
                                    } else {
                                        // direction changed
                                        p.imgIndex = 0;
                                    }
                                    p.asset = this.upwardAssets[p.imgIndex];
                                    p.lastMove = Sprite.DIRECTION_UP;
                                } else if (p.defaultAssetsCount > 0) {
                                    p.imgIndex = (p.imgIndex + step) % p.defaultAssetsCount;
                                    p.asset = this.defaultAssets[p.imgIndex];
                                } else {
                                    useFrontAssets = true;
                                }
                            }
                        /*
                        } else {
                            p.ellapsed = dt;
                        }
                        */
                    }
                }
                if (!p.moving || (p.moving && useFrontAssets)) {
                    if (p.initialized) {
                        // not moving forward nor backward
                        if (dt > p.dtPause || useFrontAssets) {
                            step = Math.floor(dt / p.dtPause);
                            p.ellapsed = dt - step * p.dtPause;
                            if (p.frontAssetsCount > 0) {
                                if (p.lastMove === Sprite.DIRECTION_NONE) {
                                    p.imgIndex = (p.imgIndex + step) % p.frontAssetsCount;
                                } else {
                                    // direction changed
                                    p.imgIndex = 0;
                                }
                                p.asset = this.frontAssets[p.imgIndex];
                                p.lastMove = Sprite.DIRECTION_NONE;
                            } else if (p.defaultAssetsCount > 0) {
                                p.imgIndex = (p.imgIndex + step) % p.defaultAssetsCount;
                                p.asset = this.defaultAssets[p.imgIndex];
                            }
                        } else {
                            p.ellapsed = dt;
                        }
                    }
                }
                p.lastX = p.x;
                p.lastY = p.y;
            }
        },
        setDownwardAssets: function (assets) {
            this.addAssetOperation(function (assets) {
                this.downwardAssets = assets;
                this.p.downwardAssetsCount = assets.length;
            }, [assets], assets);
        },
        addDownwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                this.downwardAssets.push(asset);
                this.p.downwardAssetsCount++;
            }, [asset], asset);
        },
        removeDownwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                var index = this.downwardAssets.indexOf(asset);
                if (index > -1) {
                    this.downwardAssets.splice(index, 1);
                    this.p.downwardAssetsCount--;
                }
            }, [asset]);
        },
        removeDownwardAssets: function () {
            this.addAssetOperation(function () {
                this.downwardAssets = [];
                this.p.downwardAssetsCount = 0;
            }, []);
        },
        setUpwardAssets: function (assets) {
            this.addAssetOperation(function (assets) {
                this.upwardAssets = assets;
                this.p.upwardAssetsCount = assets.length;
            }, [assets], assets);
        },
        addUpwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                this.upwardAssets.push(asset);
                this.p.upwardAssetsCount++;
            }, [asset], asset);
        },
        removeUpwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                var index = this.upwardAssets.indexOf(asset);
                if (index > -1) {
                    this.upwardAssets.splice(index, 1);
                    this.p.upwardAssetsCount--;
                }
            }, [asset]);
        },
        removeUpwardAssets: function () {
            this.addAssetOperation(function () {
                this.upwardAssets = [];
                this.p.upwardAssetsCount = 0;
            }, []);
        },
        setForwardAssets: function (assets) {
            this.addAssetOperation(function (assets) {
                this.forwardAssets = assets;
                this.p.forwardAssetsCount = assets.length;
            }, [assets], assets);
        },
        addForwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                this.forwardAssets.push(asset);
                this.p.forwardAssetsCount++;
            }, [asset], asset);
        },
        removeForwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                var index = this.forwardAssets.indexOf(asset);
                if (index > -1) {
                    this.forwardAssets.splice(index, 1);
                    this.p.forwardAssetsCount--;
                }
            }, [asset]);
        },
        removeForwardAssets: function () {
            this.addAssetOperation(function () {
                this.forwardAssets = [];
                this.p.forwardAssetsCount = 0;
            }, []);
        },
        setBackwardAssets: function (assets) {
            this.addAssetOperation(function (assets) {
                this.backwardAssets = assets;
                this.p.backwardAssetsCount = assets.length;
            }, [assets], assets);
        },
        addBackwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                this.backwardAssets.push(asset);
                this.p.backwardAssetsCount++;
            }, [asset], asset);
        },
        removeBackwardAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                var index = this.backwardAssets.indexOf(asset);
                if (index > -1) {
                    this.backwardAssets.splice(index, 1);
                    this.p.backwardAssetsCount--;
                }
            }, [asset]);
        },
        removeBackwardAssets: function () {
            this.addAssetOperation(function () {
                this.backwardAssets = [];
                this.p.backwardAssetsCount = 0;
            }, []);
        },
        setFrontAssets: function (assets) {
            this.addAssetOperation(function (value) {
                this.frontAssets = value;
                this.p.frontAssetsCount = value.length;
                this.checkSize();
            }, [assets], assets);
        },
        addFrontAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                this.frontAssets.push(asset);
                this.p.frontAssetsCount++;
                this.checkSize();
            }, [asset], asset);
        },
        removeFrontAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                var index = this.frontAssets.indexOf(asset);
                if (index > -1) {
                    this.frontAssets.splice(index, 1);
                    this.p.frontAssetsCount--;
                    this.checkSize();
                }
            }, [asset]);
        },
        removeFrontAssets: function () {
            this.addAssetOperation(function () {
                this.frontAssets = [];
                this.p.frontAssetsCount = 0;
                this.checkSize();
            }, []);
        },
        setDefaultAssets: function (assets) {
            this.addAssetOperation(function (value) {
                this.defaultAssets = value;
                this.p.defaultAssetsCount = value.length;
                this.checkSize();
            }, [assets], assets);
        },
        addDefaultAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                this.defaultAssets.push(asset);
                this.p.defaultAssetsCount++;
                this.checkSize();
            }, [asset], asset);
        },
        removeDefaultAsset: function (asset) {
            this.addAssetOperation(function (asset) {
                var index = this.defaultAssets.indexOf(asset);
                if (index > -1) {
                    this.defaultAssets.splice(index, 1);
                    this.p.defaultAssetsCount--;
                    this.checkSize();
                }
            }, [asset]);
        },
        removeDefaultAssets: function () {
            this.addAssetOperation(function () {
                this.defaultAssets = [];
                this.p.defaultAssetsCount = 0;
                this.checkSize();
            }, []);
        },
        removeAsset: function () {
            // Do nothing since assets are managed elsewhere
        },
        setVelocity: function (value) {
            this._super(value);
            // compute base dt
            this.computeDts();
        },
        setDurations: function (valueMove, valuePause) {
            this.p.durationMove = valueMove;
            this.p.durationPause = valuePause;
            this.computeDts();
        },
        setMovementDuration: function (value) {
            this.p.durationMove = value;
            this.computeDts();
        },
        setPauseDuration: function (value) {
            this.p.durationPause = value;
            this.computeDts();
        },
        computeDts: function () {
            this.addAssetOperation(function () {
                var p = this.p;
                if (p.forwardAssetsCount > 0) {
                    // we assume that forwardAssetsCount is equal to backwardAssetsCount
                    p.dtMovement = (p.durationMove / p.forwardAssetsCount) * 200 / p.speed;
                } else if (p.defaultAssetsCount > 0) {
                    // we assume that forwardAssetsCount is equal to backwardAssetsCount
                    p.dtMovement = (p.durationMove / p.defaultAssetsCount) * 200 / p.speed;
                }
                if (p.frontAssetsCount > 0) {
                    p.dtPause = (p.durationPause / p.frontAssetsCount) * 200 / p.speed;
                } else if (p.defaultAssetsCount > 0) {
                    // we assume that forwardAssetsCount is equal to backwardAssetsCount
                    p.dtPause = (p.durationPause / p.defaultAssetsCount) * 200 / p.speed;
                }
            }, []);
        },
        addAssetOperation: function (action, parameters, asset) {
            if (typeof asset === 'undefined') {
                this.assetOperations.push([action, parameters]);
            } else {
                this.assetOperations.push([action, parameters, asset]);
            }

        },
        performAssetOperations: function () {
            while (this.assetOperations.length > 0) {
                var operation = this.assetOperations[0];
                var test = true;
                if (operation.length > 2) {
                    // This operation require a test on assets first
                    var asset = operation[2];
                    if (asset instanceof Array) {
                        // several assets have to be checked
                        for (var i = 0; i < asset.length; i++) {
                            if (!this.resources.ready(asset[i])) {
                                // one of the assets is not loaded yet
                                test = false;
                                break;
                            }
                        }
                    } else if (!this.resources.ready(asset)) {
                        // only one asset has to be checked: not loaded
                        test = false;
                    }
                }
                if (!test) {
                    // Assets are missing: we break here
                    break;
                }
                this.assetOperations.shift();
                operation[0].apply(this, operation[1]);
            }
        },
        stopAutoAsset: function () {
            this.p.autoAsset = false;
        },
        startAutoAsset: function () {
            this.p.autoAsset = true;
        },
        mayCatch: function (object) {
            var id = object.getGObject().getId();
            if (typeof (this.catchableObjects[id]) === 'undefined') {
                this.catchableObjects[id] = object;
            }
        },
        objectEncountered: function (col) {
            this._super(col);
            var object = col.obj;
            if (typeof object.getId !== 'undefined') {
                var id = object.getId();
                if (typeof (this.catchableObjects[id]) !== 'undefined') {
                    this.catchableObjects[id]._delete();
                }
            }
        },
        checkSize: function () {
            if (this.p.sizeSet && this.p.frontAssetsCount === 0 && this.p.defaultAssetsCount === 0) {
                var deltaW = -this.p.w / 2;
                var deltaH = -this.p.h / 2;
                this.p.w = 0;
                this.p.h = 0;
                this.p.x += deltaW;
                this.p.y += deltaH;
                this.p.destinationX += deltaW;
                this.p.destinationY += deltaH;
                graphics.objectResized(this);
                this.p.sizeSet = false;
            } else if (!this.p.sizeSet) {
                graphics.objectResized(this);
            }
        },
        size: function (force) {
            if (force || (!this.p.w || !this.p.h)) {
                var asset = false;
                if (this.p.defaultAssetsCount > 0) {
                    // base on first default asset
                    var assetName = this.defaultAssets[0];
                    if (this.resources.ready(assetName)) {
                        asset = this.resources.get(assetName);
                    }
                } else if (this.p.frontAssetsCount > 0) {
                    // base on first forward asset
                    var assetName = this.frontAssets[0];
                    if (this.resources.ready(assetName)) {
                        asset = this.resources.get(assetName);
                    }
                }
                if (asset) {
                    var deltaW = asset.width / 2 - this.p.w / 2;
                    var deltaH = asset.height / 2 - this.p.h / 2;
                    this.p.w = asset.width;
                    this.p.h = asset.height;
                    this.p.x += deltaW;
                    this.p.y += deltaH;
                    this.p.destinationX += deltaW;
                    this.p.destinationY += deltaH;
                    this.p.sizeSet = true;
                }
            }
            this.p.cx = (force || this.p.cx === void 0) ? (this.p.w / 2) : this.p.cx;
            this.p.cy = (force || this.p.cy === void 0) ? (this.p.h / 2) : this.p.cy;
        },
        draw: function (ctx) {
            // check if asset is ready
            if (this.p.asset && this.resources.ready(this.p.asset)) {
                this._super(ctx);
            }
        },
        addMove: function(direction, value) {
            this.moves.add({direction:direction, value:value});
            if (this.p.direction !== Sprite.DIRECTION_NONE) {

            }
        },
        nextMove: function() {
            if (this.moves.length>0) {
                var next = this.moves.splice(0,1);
                switch (next.direction) {
                    case Sprite.DIRECTION_RIGHT:
                        this.moveForward(next.value);
                        break;
                    case Sprite.DIRECTION_LEFT:
                        this.moveBackward(next.value);
                        break;
                    case Sprite.DIRECTION_UP:
                        this.moveUpward(next.value);
                        break;
                    case Sprite.DIRECTION_DOWN:
                        this.moveDownward(next.value);
                        break;
                }
            }
        }


    });


    /**
     * Creates a new character, and add it in resource.
     * @param {String} name Character's name
     */
    Character.prototype._setAspect = function (name) {
        name = TUtils.getString(name);
        name = this.getMessage(name);
        this.aspectName = name;
        this.custom = false;
        var baseCharacterUrl = this.getResource(name) + "/";
        var configUrl = baseCharacterUrl + "config.json";
        var self = this;
        this.loadJSON(
            configUrl,
            function (data) {
                // check that nothing changed during load
                if (self.custom || self.aspectName != name) {
                    return;
                }
                self.gObject.initialized(false);
                var currentLocation = self.gObject.getLocation();
                var frontImages = data['images']['front'];
                //var frontAssets = [];
                try {
                    self._removeImageSet(self.translatedFront);
                } catch (e) { }
                
                for (var i = 0; i < frontImages.length; i++) {
                    var imageName = name + "/" + frontImages[i];
                    //frontAssets.push(imageName);
                    self.gObject.addFrontAsset(imageName);
                    self.addImage(imageName, self.translatedFront, false);
                }
                //self.gObject.setFrontAssets(frontAssets);
                var downwardImages = data['images']['downward'];
                if (downwardImages) {
                    var downwardAssets = [];
                    try {
                        self._removeImageSet(self.translatedDownward);
                    } catch (e) {
                    }
                    for (var i = 0; i < downwardImages.length; i++) {
                        var imageName = name + "/" + downwardImages[i];
                        downwardAssets.push(imageName);
                        self.addImage(imageName, self.translatedDownward, false);
                    }
                    self.gObject.setDownwardAssets(downwardAssets);
                }
                var upwardImages = data['images']['upward'];
                if (upwardImages) {
                    var upwardAssets = [];
                    try {
                        self._removeImageSet(self.translatedUpward);
                    } catch (e) {
                    }
                    for (var i = 0; i < upwardImages.length; i++) {
                        var imageName = name + "/" + upwardImages[i];
                        upwardAssets.push(imageName);
                        self.addImage(imageName, self.translatedUpward, false);
                    }
                    self.gObject.setUpwardAssets(upwardAssets);
                }
                var forwardImages = data['images']['forward'];
                var forwardAssets = [];
                try {
                    self._removeImageSet(self.translatedForward);
                } catch (e) {
                }
                for (var i = 0; i < forwardImages.length; i++) {
                    var imageName = name + "/" + forwardImages[i];
                    forwardAssets.push(imageName);
                    self.addImage(imageName, self.translatedForward, false);
                }
                self.gObject.setForwardAssets(forwardAssets);
                var backwardImages = data['images']['backward'];
                var backwardAssets = [];
                try {
                    self._removeImageSet(self.translatedBackward);
                } catch (e) {
                }
                for (var i = 0; i < backwardImages.length; i++) {
                    var imageName = name + "/" + backwardImages[i];
                    backwardAssets.push(imageName);
                    self.addImage(imageName, self.translatedBackward, false);
                }
                self.gObject.setBackwardAssets(backwardAssets);
                // remove default imageSet
                try {
                    self._removeImageSet("");
                } catch (e) {
                }
                self.gObject.removeDefaultAssets();
                self._displayNextImage(self.translatedFront);
                //self.gObject.setLocation(currentLocation.x, currentLocation.y);
                self.gObject.setDurations(data['durationMove'], data['durationPause']);
                self.custom = false;
            },
            function (error) {
                throw new Error(TUtils.format(self.getMessage("unknown character"), name));
            }
        );
    };

    /**
     * Checks if 'set' is in predefined strings.
     * Is used to find correct image to add / remove.
     * @param {String} set  String which can be predefined
     * @returns {String}    Returns a corresponding string if found,
     * else returns "default".
     */
    Character.prototype.checkSet = function (set) {
        var specialSet = false;
        if (typeof set !== 'undefined') {
            set = TUtils.getString(set);
            if (set === this.translatedFront) {
                specialSet = "front";
            } else if (set === this.translatedDownward) {
                specialSet = "downward";
            } else if (set === this.translatedUpward) {
                specialSet = "upward";
            } else if (set === this.translatedBackward) {
                specialSet = "backward";
            } else if (set === this.translatedForward) {
                specialSet = "forward";
            } else if (set === "") {
                specialSet = "default";
            }
        } else {
            specialSet = "default";
        }
        return specialSet;
    };

    /**
     * Add a customized image for the Character. Removes default asset if existing.
     * @param {String} name
     * @param {String} set
     */
    Character.prototype._addImage = function (name, set) {
        var specialSet = this.checkSet(set);
        var currentLocation = false;
        if (!this.custom && specialSet !== false) {
            // We begin to customize: we remove default sets
            try {
                this._removeImageSet(this.translatedFront);
            } catch (e) {
            }
            try {
                this._removeImageSet(this.translatedDownward);
            } catch (e) {
            }
            try {
                this._removeImageSet(this.translatedUpward);
            } catch (e) {
            }
            try {
                this._removeImageSet(this.translatedForward);
            } catch (e) {
            }
            try {
                this._removeImageSet(this.translatedBackward);
            } catch (e) {
            }
            try {
                this._removeImageSet("");
            } catch (e) {
            }
            currentLocation = this.gObject.getLocation();
        }
        this.addImage(name, set, true);
        if (specialSet !== false) {
            switch (specialSet) {
                case "front":
                    this.gObject.addFrontAsset(name);
                    break;
                case "downward":
                    this.gObject.addDownwardAsset(name);
                    break;
                case "upward":
                    this.gObject.addUpwardAsset(name);
                    break;
                case "backward":
                    this.gObject.addBackwardAsset(name);
                    break;
                case "forward":
                    this.gObject.addForwardAsset(name);
                    break;
                case "default":
                    this.gObject.addDefaultAsset(name);
                    break;
            }
            this.gObject.computeDts();
            if (!this.custom) {
                this.custom = true;
                this.gObject.initialized(false);
                this._displayNextImage(set);
                /*if (currentLocation !== false) {
                 this.gObject.setLocation(currentLocation.x, currentLocation.y);
                 }*/
            }
        }
    };

    /**
     * Set AutoAsset to false.
     */
    Character.prototype._stopAutoAsset = function () {
        this.gObject.stopAutoAsset();
    };

    /**
     * Set AutoAsset to true.
     */
    Character.prototype._startAutoAsset = function () {
        this.gObject.startAutoAsset();
    };

    /**
     * Removes a customized image.
     * @param {String} name
     * @param {String} set
     */
    Character.prototype._removeImage = function (name, set) {
        var specialSet = this.checkSet(set);
        this.removeImage(name, set);
        if (specialSet !== false) {
            switch (specialSet) {
                case "front":
                    this.gObject.removeFrontAsset(name);
                    break;
                case "downward":
                    this.gObject.removeDownwardAsset(name);
                    break;
                case "upward":
                    this.gObject.removeUpwardAsset(name);
                    break;
                case "backward":
                    this.gObject.removeBackwardAsset(name);
                    break;
                case "forward":
                    this.gObject.removeForwardAsset(name);
                    break;
                case "default":
                    this.gObject.removeDefaultAsset(name);
                    break;
            }
            this.gObject.computeDts();
        }
    };

    /**
     * Removes a complete set of images.
     * @param {String} name
     */
    Character.prototype._removeImageSet = function (name) {
        var specialSet = this.checkSet(name);
        Sprite.prototype._removeImageSet.call(this, name);
        if (specialSet !== false) {
            switch (specialSet) {
                case "front":
                    this.gObject.removeFrontAssets();
                    break;
                case "downward":
                    this.gObject.removeDownwardAssets();
                    break;
                case "upward":
                    this.gObject.removeUpwardAssets();
                    break;
                case "backward":
                    this.gObject.removeBackwardAssets();
                    break;
                case "forward":
                    this.gObject.removeForwardAssets();
                    break;
                case "default":
                    this.gObject.removeDefaultAssets();
                    break;
            }
            this.gObject.computeDts();
        }
    };

    /**
     * Set the Movement Duration to "value".
     * @param {Number} value
     */
    Character.prototype._setMovementDuration = function (value) {
        value = TUtils.getInteger(value);
        this.gObject.setMovementDuration(value / 1000);
    };

    /**
     * Set the Pause Duration to the "value".
     * @param {Number} value
     */
    Character.prototype._setPauseDuration = function (value) {
        value = TUtils.getInteger(value);
        this.gObject.setPauseDuration(value / 1000);
    };

    /**
     * Associate a Scene to Character.
     * @param {Scene} object
     */
    Character.prototype._addScene = function (object) {
        this._addBlock(object);
    };

    /**
     * Let Character catch the object entered in parameter.
     * @param {Object} object
     */
    Character.prototype._mayCatch = function (object) {
        object = TUtils.getObject(object);
        this.gObject.mayCatch(object);
    };

    /**
     * Execute command if Character catch the object.
     * @param {Object} object
     * @param {String} command  Command triggered if Character catch object
     */
    Character.prototype._ifCatch = function (object, command) {
        object = TUtils.getObject(object);
        command = TUtils.getString(command);
        this.gObject.mayCatch(object);
        this.gObject.addCollisionCommand(command, object);
    };

    return Character;
});
