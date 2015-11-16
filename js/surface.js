(function(){

    var utils = Paintr.utils;

    function Surface(config){
        config = config || {};

        this._element = config.element || null;
        this._callbacks = {
            onchange: config.onchange || new Function()
        };
        this._settings = {
            width: config.width,
            height: config.height,
            strokeColor: config.strokeColor,
            strokeWidth: config.strokeWidth
        };

        this._init();
    }

    Surface.prototype = {

        set: function(key, value) {
            this._settings[key] = value;
        },

        undo: function() {
            this._recordr.undo();
            this._redraw();
            this._callbacks.onchange();
        },

        redo: function() {
            this._recordr.redo();
            this._redraw();
            this._callbacks.onchange();
        },

        canUndo: function() {
            return this._recordr.canUndo();
        },

        canRedo: function() {
            return this._recordr.canRedo();
        },

        exportDataURI: function() {
            return this._canvas.toDataURL();
        },

        _canvas: null,
        _context: null,
        _recordr: null,
        _getCanvasData: function() {
            return this._canvas.toDataURL();
        },
        _redraw: function() {
            var ctx = this._context,
                recordr = this._recordr,
                bg = recordr.getBackground() || {},
                i, click, prevClick;

            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            if (bg.image) {
                ctx.drawImage(bg.image, 0, 0);
            }
            ctx.lineJoin = "round";
            ctx.lineWidth = 5;

            for(i = 0; i < recordr.numClicks(); i++) {
                click = recordr.getClick(i);
                prevClick = recordr.getClick(i - 1);
                ctx.beginPath();

                if(click.dragging && i){
                    ctx.moveTo(prevClick.x, prevClick.y);
                }else{
                    ctx.moveTo(click.x - 1, click.y);
                }
                ctx.lineTo(click.x, click.y);
                ctx.closePath();
                ctx.strokeStyle = click.color;
                ctx.lineWidth = click.weight;
                ctx.stroke();
            }
        },
        _init: function() {
            this._recordr = new Paintr.Recordr();
            this._initElement();
            this._initCanvas();
            this._attachCanvasEvents();
        },
        _initElement: function() {
            this._element.className = [this._element.className, 'paintr-surface'].join(' ');
        },
        _initCanvas: function() {
            this._canvas = document.createElement('canvas');
            this._canvas.className = [this._canvas.className, 'paintr-surface-canvas'].join(' ');
            this._canvas = utils.canvasIEFallback(this._canvas);
            this._canvas.setAttribute('width', this._settings.width);
            this._canvas.setAttribute('height', this._settings.height);
            this._element.appendChild(this._canvas);
            this._context = this._canvas.getContext('2d'); 
        },
        _attachCanvasEvents: function() {
            if (!utils.isTouchDevice()) {
                this._attachCanvasMousedown();
                this._attachCanvasMousemove();
                this._attachCanvasMouseup();
                this._attachCanvasMouseleave();
            } else {
                this._attachCanvasTouchstart();
                this._attachCanvasTouchmove();
                this._attachCanvasTouchstop();
                this._attachCanvasTouchcancel();
            }
        },

        _attachCanvasMousedown: function() {
            var self = this;
            self._canvas.addEventListener('mousedown', function(e) {
                self._handleCanvasMousedown(e);
            });
        },
        _attachCanvasMousemove: function() {
            var self = this;
            self._canvas.addEventListener('mousemove', function(e) {
                self._handleCanvasMousemove(e);
            });  
        },
        _attachCanvasMouseup: function() {
            var self = this;
            self._canvas.addEventListener('mouseup', function(e) {
                self._handleCanvasMouseup(e);
            });
        },
        _attachCanvasMouseleave: function() {
            var self = this;
            self._canvas.addEventListener('mouseleave', function(e) {
                self._handleCanvasMouseleave(e);
            });
        },
        _attachCanvasTouchstart: function() {
            var self = this;
            self._canvas.addEventListener('touchstart', function(e) {
                self._handleCanvasMousedown(e);
            });
        },
        _attachCanvasTouchmove: function() {
            var self = this;
            self._canvas.addEventListener('touchmove', function(e) {
                self._handleCanvasMousemove(e);
            });
        },
        _attachCanvasTouchstop: function() {
            var self = this;
            self._canvas.addEventListener('touchstop', function(e) {
                self._handleCanvasMouseup(e);
            });
        },
        _attachCanvasTouchcancel: function() {
            var self = this;
            self._canvas.addEventListener('touchcancel', function(e) {
                self._handleCanvasMouseup(e);
            });
        },

         _handleCanvasMousedown: function(e) {
            var mouseX = e.pageX - this.offsetLeft;
            var mouseY = e.pageY - this.offsetTop;

            this._painting = true;
            this._recordr.addClick({
                x: e.pageX - this._element.offsetLeft,
                y: e.pageY - this._element.offsetTop,
                color: this._settings.strokeColor,
                weight: this._settings.strokeWidth,
                dragging: false
            });
            this._redraw();
            this._callbacks.onchange();
        },

        _handleCanvasMousemove: function(e) {
            if (this._painting) {
                this._recordr.addClick({
                    x: e.pageX - this._element.offsetLeft,
                    y: e.pageY - this._element.offsetTop,
                    color: this._settings.strokeColor,
                    weight: this._settings.strokeWidth,
                    dragging: true
                });
                this._redraw();
                this._callbacks.onchange();
            }
        },

        _handleCanvasMouseup: function() {
            this._painting = false;
        },

        _handleCanvasMouseleave: function(e) {
            this._handleCanvasMouseup(e);
        },

        _calculateBGDimensions: function(image) {

        },

        _loadNewBackground: function(url) {
            var self = this,
                img;
            if (url) {
                img = new Image();
                img.onload = function() {
                    self._recordr.addBackground(img);
                    self._redraw();
                };
                img.src = url;
            }
        }
    };

    if (!window.Paintr.Surface) {
        window.Paintr.Surface = Surface;
    }
})();