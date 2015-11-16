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
            onundo: params.onundo || new Function(),
            onredo: params.onredo || new Function(),
            onexport: params.onexport || new Function()
        }
        this._defaultStrokeColor = params.strokeColor || null;
        this._defaultStrokeWidth = params.strokeWidth || null;
        this._init();
    }

    Tools.prototype = {
        _init: function() {
            this._initElement();
            this._render();
            this._attachEventListeners();
        },

        _initElement: function() {
            this._element.className = [this._element.className, 'paintr-tools'].join(' ');
        },

        _render: function() {
            this._element.innerHTML = this._getMarkup();
            this._strokeColorInput = this._element.querySelector('.paintr-tools-strokecolor');
            this._strokeWidthInput = this._element.querySelector('.paintr-tools-strokewidth');
            this._undoButton = this._element.querySelector('.paintr-tools-undo');
            this._redoButton = this._element.querySelector('.paintr-tools-redo');
            this._exportButton = this._element.querySelector('.paintr-tools-export');
        },

        _attachEventListeners: function() {
            var self = this; 
            this._strokeColorInput.addEventListener('change', function(e) {
                self._handleToolChangeEvent(e);
            });
            this._strokeWidthInput.addEventListener('change', function(e) {
                self._handleToolChangeEvent(e);
            });
            this._undoButton.addEventListener('click', function(e){
                self._handleUndoRedoEvent(e, 'undo');
            });
            this._redoButton.addEventListener('click', function(e){
                self._handleUndoRedoEvent(e, 'redo');
            });
            this._exportButton.addEventListener('click', function(e){
                self._handleExportEvent();
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
            var onchange = this._callbacks.onchange,
                target = e.target;
            if (target === this._strokeColorInput) {
                onchange('strokeColor', target.value);
            } else if (target === this._strokeWidthInput) {
                onchange('strokeWidth', target.value);
            }
        },

        _handleExportEvent: function() {
            this._callbacks.onexport();
        },

        _getMarkup: function() {
            var html = '',
                strokeWidthControl = ['<li>', this._getStrokeWidthControlMarkup(), '</li>'].join(''),
                strokeColorControl = ['<li>', this._getStrokeColorControlMarkup(), '</li>'].join(''),
                divider = '<li class="paintr-tools-divider"></li>',
                undoButton = ['<li>', this._getUndoControlMarkup(), '</li>'].join(''),
                redoButton = ['<li>', this._getRedoControlMarkup(), '</li>'].join(''),
                exportButton = ['<li>', this._getExportControlMarkup(), '</li>'].join('');

            return ['<ul>', 
                strokeColorControl, 
                strokeWidthControl, 
                divider, 
                undoButton, 
                redoButton, 
                divider,
                exportButton,
            '</ul>'].join('');
        },

        _getStrokeColorControlMarkup: function() {
            return ['<input type="color" class="paintr-tools-strokecolor" value="', this._defaultStrokeColor, '">'].join('');
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
        },

        _getExportControlMarkup: function() {
            return '<button class="paintr-tools-export">export</button>';
        },

        enableUndo: function() {
            this._undoButton.classList.remove('disabled');
            this._undoButton.disabled = false;
        },

        disableUndo: function() {
            this._undoButton.classList.add('disabled');
            this._undoButton.disabled = true;
        },

        enableRedo: function() {
            this._redoButton.classList.remove('disabled');
            this._redoButton.disabled = false;
        },

        disableRedo: function() {
            this._redoButton.classList.add('disabled');
            this._redoButton.disabled = true;
        }
    };

    if (!window.Paintr.Tools) {
        window.Paintr.Tools = Tools;
    }

})();