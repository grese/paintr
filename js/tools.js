(function() {

    var DEFAULTS = {
        strokeWidths: [
            {label: 'x-thin', value: 1},
            {label: 'thin', value: 3},
            {label: 'normal', value: 5},
            {label: 'thick', value: 10},
            {label: 'x-thick', value: 15}
        ]
    };

    /**
     * Tools - generates a toolset for Surface
     * @param params (Object)
     *     - element (HTML element) element for tools
     *     - strokeColor (String)
     */
    function Tools(params) {
        params = params || {};
        this._element = params.element;
        this._callbacks = {
            onchange: params.onchange,
            onundo: params.onundo,
            onredo: params.onredo
        }
        this._defaultStrokeColor = params.strokeColor || null;
        this._defaultStrokeWidth = params.strokeWidth || null;
        this._init();
    }

    Tools.prototype = {
        _init: function() {
            this._initElement();
            this._render();
            this._formElements = {
                strokeColor: this._element.querySelector('.paintr-tools-strokecolor'),
                strokeWidth: this._element.querySelector('.paintr-tools-strokewidth')
            };
            this._buttons = {
                undo: this._element.querySelector('.paintr-tools-undo'),
                redo: this._element.querySelector('.paintr-tools-redo')
            };
            this._attachEventListeners();
        },

        _initElement: function() {
            this._element.className = [this._element.className, 'paintr-tools'].join(' ');
        },

        _render: function() {
            this._element.innerHTML = this._getMarkup();
        },

        _attachEventListeners: function() {
            var key,
                self = this; 
            for(key in this._formElements) {
                if (this._formElements.hasOwnProperty(key)) {
                    this._formElements[key].addEventListener('change', function(e) {
                        self._handleToolChangeEvent(e);
                    });
                }
            }
            this._buttons.undo.addEventListener('click', function(e){
                self._handleUndoRedoEvent(e, 'undo');
            });
            this._buttons.redo.addEventListener('click', function(e){
                self._handleUndoRedoEvent(e, 'redo');
            });
        },

        _handleUndoRedoEvent: function(e, type) {
            var onundo = this._callbacks.onundo,
                onredo = this._callbacks.onredo;
            if (type === 'undo') {
                onundo(e);
            } else if (type === 'redo') {
                onredo(e);
            }
        },

        _handleToolChangeEvent: function(e) {
            var change = this._callbacks.onchange,
                target = e.target;
            if (target === this._formElements.strokeColor) {
                change('strokeColor', target.value);
            } else if (target === this._formElements.strokeWidth) {
                change('strokeWidth', target.value);
            }
        },

        _getMarkup: function() {
            var html = '',
                strokeWidthControl = ['<li>', this._getStrokeWidthControlMarkup(), '</li>'].join(''),
                strokeColorControl = ['<li>', this._getStrokeColorControlMarkup(), '</li>'].join(''),
                divider = '<li class="paintr-tools-divider">|</li>',
                undoButton = ['<li>', this._getUndoControlMarkup(), '</li>'].join(''),
                redoButton = ['<li>', this._getRedoControlMarkup(), '</li>'].join('');

            return ['<ul>', 
                strokeColorControl, 
                strokeWidthControl, 
                divider, 
                undoButton, 
                redoButton, 
            '</ul>'].join('');
        },

        _getStrokeColorControlMarkup: function() {
            return '<input type="color" class="paintr-tools-strokecolor" value="' + this._defaultStrokeColor + '">';
        },

        _getStrokeWidthControlMarkup: function() {
            var widths = DEFAULTS.strokeWidths,
                opts = '',
                sel = false,
                opt, i;
            for(i = 0; i < widths.length; i++) {
                sel = (widths[i].value === this._defaultStrokeWidth);
                opts += ['<option value="', widths[i].value, '" ', (sel ? 'selected="selected"' : ''), '>',  widths[i].label, '</option>'].join('');
            }
            return ['<select class="paintr-tools-strokewidth">', opts, '</select>'].join('');
        },

        _getUndoControlMarkup: function() {
            return '<button class="paintr-tools-undo">undo</button>';
        },

        _getRedoControlMarkup: function() {
            return '<button class="paintr-tools-redo">redo</button>';
        }
    };

    if (!window.Paintr.Tools) {
        window.Paintr.Tools = Tools;
    }

})();