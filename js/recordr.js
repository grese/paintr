(function() {

    function Recordr() {}

    Recordr.prototype = {
        _clicks: [],
        _undos: [],
        _bgs: [],
        
        canUndo: function() {
            return this._clicks.length > 0;
        },

        canRedo: function() {
            return this._undos.length > 0;
        },

        undo: function() {
            var end = (this._clicks.length - 1),
                start = end,
                stroke, i;
            
            for (i = end; i >= 0; i--) {
                if (this._clicks[i] && !this._clicks[i].dragging) {
                    start = i;
                    break;
                }
            }

            stroke = this._clicks.splice(start, (end - start) + 1);
            if (stroke.length) {
                this._undos.push(stroke);
            }
        },

        redo: function() {
            var stroke = this._undos.pop();
            if (stroke && stroke.length) {
                this._clicks = this._clicks.concat(stroke);
            }
        },

        numClicks: function() {
            return this._clicks.length;
        },

        getClick: function(idx) {
            return this._clicks[idx];
        },

        addClick: function(params) {
            this._clicks.push({
                x: params.x,
                y: params.y,
                dragging: params.dragging,
                color: params.color,
                weight: params.weight
            });
        },

        /**
         * addBackground
         * @param params (Object)
         *     - type (String) 'color' or 'image'
         *     - color (String) only if type is color
         *     - image (Image) only if type is image
         */
        addBackground: function(params) {
            var i,
                obj;

            // Make all other backgrounds inactive...
            for (i = 0; i < this._bgs.length; i++) {
                if (this._bgs[i]) {
                    this._bgs[i].active = false;
                }
            }

            if (params.type === 'color') {
                obj = {
                    type: 'color',
                    color: params.color,
                    active: true
                };
            }

            if (params.type === 'image') {
                obj = {
                    type: 'image',
                    image: params.image,
                    active: true
                };
            }

            this._bgs.push(obj);
        },

        getBackground: function() {
            return this._bgs[this._bgs.length - 1];
        }

    };

    if (!window.Paintr.Recordr) {
        window.Paintr.Recordr = Recordr;
    }

})();