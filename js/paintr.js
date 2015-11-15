(function(){

    var DEFAULTS = {
        width: 400,
        height: 200,
        strokeColor: '#42d9f7',
        strokeWidth: 5
    };

    function Paintr(params) {
        this._element = params.element || null;
        this.width = params.width || DEFAULTS.width;
        this.height = params.height || DEFAULTS.height;

        this._init();
    }

    Paintr.prototype = {
        _init: function() {
            this._initTools();
            this._initSurface();
        },

        _initSurface: function() {
            var element = document.createElement('div');
            this._surface = new Paintr.Surface({
                width: this.width,
                height: this.height,
                element: element,
                strokeColor: DEFAULTS.strokeColor,
                strokeWidth: DEFAULTS.strokeWidth
            });
            this._element.appendChild(element);
        },

        _handleToolsChange: function(key, value) {
            this._surface.set(key, value);
        },

        _handleUndo: function() {
            this._surface.undo();
        },

        _handleRedo: function() {
            this._surface.redo();
        },

        _initTools: function() {
            var element = document.createElement('div'),
                self = this;
            this._tools = new Paintr.Tools({
                element: element,
                strokeColor: DEFAULTS.strokeColor,
                strokeWidth: DEFAULTS.strokeWidth,
                onchange: function(key, value) {
                    self._handleToolsChange(key, value);
                },
                onundo: function() {
                    self._handleUndo();
                },
                onredo: function() {
                    self._handleRedo();
                }
            });
            this._element.appendChild(element);
        }
    };

    if (!window.Paintr) {
        window.Paintr = Paintr;
    }
})();