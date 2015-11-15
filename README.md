# paintr
A javascript paint tool using canvas.
- Lightweight
- Written in plain-ol Javascript (No third-party dependencies).

## Usage:
Eventually, there will be a minified production file, but for now
include the following files in your browser:
- css/paintr.css
- js/paintr.js
- js/utils.js
- js/recordr.js
- js/tools.js
- js/surface.js

Then, execute the following code:
```javascript
// pass an HTML Node (e.g. a 'div') to render the Paintr into.
var element = document.getElementById('paintr'), 
    paintr = new Paintr({
        width: 400, // integer
        height: 200, // integer
        element: element // HTML Node
    });
```