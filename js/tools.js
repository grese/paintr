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
        this._isOpen = true;
        this._element = params.element;
        this._settings = {
            surfaceHeight: params.surfaceHeight
        };
        this._callbacks = {
            onchange: params.onchange,
            onundo: params.onundo || function(){},
            onredo: params.onredo || function(){},
            onexport: params.onexport || function(){}
        };
        this._defaultStrokeColor = params.strokeColor || null;
        this._defaultStrokeWidth = params.strokeWidth || null;
        this._defaultBgColor = params.bgColor || null;
        this._init();
    }

    Tools.prototype = {
        _init: function() {
            this._initElement();
            this._render();
            this._attachEventListeners();
        },

        _initElement: function() {
            this._element.classList.add('paintr-tools');
            if (this._settings.surfaceHeight) {
                this._element.style.height = this._settings.surfaceHeight + 'px';
            }
        },

        _render: function() {
            this._element.innerHTML = this._getMarkup();
            this._toggleButton = this._element.querySelector('.paintr-tools-toggle');
            this._strokeColorInput = this._element.querySelector('.paintr-tools-strokecolor');
            this._strokeWidthInput = this._element.querySelector('.paintr-tools-strokewidth');
            this._bgColorInput = this._element.querySelector('.paintr-tools-bgcolor');
            this._undoButton = this._element.querySelector('.paintr-tools-undo');
            this._redoButton = this._element.querySelector('.paintr-tools-redo');
            this._exportButton = this._element.querySelector('.paintr-tools-export');
        },

        _attachEventListeners: function() {
            this._toggleButton.addEventListener('click', this._toggleTools.bind(this));
            this._strokeColorInput.addEventListener('change', this._handleToolChangeEvent.bind(this));
            this._strokeWidthInput.addEventListener('change', this._handleToolChangeEvent.bind(this));
            this._bgColorInput.addEventListener('change', this._handleToolChangeEvent.bind(this));
            this._undoButton.addEventListener('click', this._handleUndoEvent.bind(this));
            this._redoButton.addEventListener('click', this._handleRedoEvent.bind(this));
            this._exportButton.addEventListener('click', this._handleExportEvent.bind(this));
        },

        _toggleTools: function() {
            if (this._isOpen) {
                this._element.classList.add('closed');
                this._isOpen = false;
            } else {
                this._element.classList.remove('closed');
                this._isOpen = true;
            }
        },

        _handleUndoEvent: function(e) {
            this._callbacks.onundo(e);
        },

        _handleRedoEvent: function(e) {
            this._callbacks.onredo(e);
        },

        _handleToolChangeEvent: function(e) {
            var onchange = this._callbacks.onchange,
                target = e.target;
            if (target === this._strokeColorInput) {
                onchange('strokeColor', target.value);
            } else if (target === this._strokeWidthInput) {
                onchange('strokeWidth', target.value);
            } else if (target === this._bgColorInput) {
                onchange('backgroundColor', target.value);
            }
        },

        _handleExportEvent: function() {
            this._callbacks.onexport();
        },

        _getMarkup: function() {
            return [this._getToggleMarkup(), this._getToolsMarkup()].join('');
        },

        _getToolsMarkup: function() {
            var html = '',
                settingsToggle = this._getToggleMarkup(),
                strokeColorControl = ['<li>', this._getStrokeColorControlMarkup(), '</li>'].join(''),
                strokeWidthControl = ['<li>', this._getStrokeWidthControlMarkup(), '</li>'].join(''),
                bgColorControl = ['<li>', this._getBGColorControlMarkup(), '</li>'].join(''),
                divider = '<li class="paintr-tools-divider"></li>',
                undoButton = ['<li>', this._getUndoControlMarkup(), '</li>'].join(''),
                redoButton = ['<li>', this._getRedoControlMarkup(), '</li>'].join(''),
                exportButton = ['<li>', this._getExportControlMarkup(), '</li>'].join('');

            return [
            '<ul>', 
                strokeColorControl, 
                strokeWidthControl,
                divider,
                bgColorControl,
                divider,
                undoButton, 
                redoButton, 
                divider,
                exportButton,
            '</ul>'].join('');
        },

        _getToggleMarkup: function() {
            return '<div class="paintr-tools-header"><button class="paintr-tools-toggle"><span class="fa fa-gear icon"></span></button></div>';
        },

        _getBGColorControlMarkup: function() {
            return ['<span class="label">Background:</span><br/><input type="color" class="paintr-tools-bgcolor" value="', (this._defaultBgColor || ''), '">'].join('');
        },

        _getStrokeColorControlMarkup: function() {
            return ['<span class="label">Stroke:</span><br/><input type="color" class="paintr-tools-strokecolor" value="', (this._defaultStrokeColor || ''), '">'].join('');
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