(function(){

    var DEFAULTS = {
        width: 400,
        height: 200,
        strokeColor: '#42d9f7',
        strokeWidth: 5,
        bgColor: '#ffffff'
    };

    function Paintr(params) {
        this._element = params.element || null;
        this.width = params.width || DEFAULTS.width;
        this.height = params.height || DEFAULTS.height;

        this._init();
    }

    Paintr.prototype = {
        _init: function() {
            this._initElement();
            this._initSurface();
            this._initTools();
        },

        _initElement: function() {
            this._element.classList.add('paintr');
        },

        _initSurface: function() {
            var element = document.createElement('div'),
                self = this;
            this.surface = new Paintr.Surface({
                width: this.width,
                height: this.height,
                element: element,
                strokeColor: DEFAULTS.strokeColor,
                strokeWidth: DEFAULTS.strokeWidth,
                onchange: function() {
                    self._handleSurfaceChange();
                }
            });
            this._element.appendChild(element);
        },

        _handleSurfaceChange: function() {
            if (this.surface.canUndo()) {
                this.tools.enableUndo();
            } else {
                this.tools.disableUndo();
            }

            if (this.surface.canRedo()) {
                this.tools.enableRedo();
            } else {
                this.tools.disableRedo();
            }
        },

        _handleToolsChange: function(key, value) {
            if (key === 'backgroundColor') {
                this.surface.updateBackgroundColor(value);
            } else {
                this.surface.set(key, value);
            }
        },

        _handleUndo: function() {
            this.surface.undo();
        },

        _handleRedo: function() {
            this.surface.redo();
        },

        _handleExport: function() {
            console.log('DATA URI: ', this.exportDataURI());
        },

        _initTools: function() {
            var element = document.createElement('div'),
                self = this;
            this.tools = new Paintr.Tools({
                element: element,
                surfaceHeight: this.height,
                strokeColor: DEFAULTS.strokeColor,
                strokeWidth: DEFAULTS.strokeWidth,
                bgColor: DEFAULTS.bgColor,
                onchange: function(key, value) {
                    self._handleToolsChange(key, value);
                },
                onundo: function() {
                    self._handleUndo();
                },
                onredo: function() {
                    self._handleRedo();
                },
                onexport: function() {
                    self._handleExport();
                }
            });
            this._element.appendChild(element);
            this.tools.disableUndo();
            this.tools.disableRedo();
        },

        exportDataURI: function() {
            return this.surface.exportDataURI();
        }
    };

    if (!window.Paintr) {
        window.Paintr = Paintr;
    }
})();