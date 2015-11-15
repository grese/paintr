(function(){

    var utils = {

        canvasIEFallback: function(canvas) {
            if(typeof window.G_vmlCanvasManager != 'undefined') {
                canvas = window.G_vmlCanvasManager.initElement(canvas);
            }
            return canvas;
        },

        isTouchDevice: function() {
            var el = document.createElement('div');
            el.setAttribute('ontouchstart', 'return;');
            return typeof el.ontouchstart === "function";
        }
    };

    if (!window.Paintr.utils) {
        window.Paintr.utils = utils;
    }
    
})();