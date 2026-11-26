# Merry Christmas Max, by Amber

A browser-based Christmas greeting with an emerald green particle tree, ruby red spiral ribbons, orange ornaments, falling snow and a golden star.

Open the published page directly — no installation, login or external libraries required.

Drag to rotate; scroll to zoom. Use Pause / Play and Reset in the lower corner. The page adapts to phone screens and respects reduced-motion preferences.

The original Python version was adapted from [Pink-Gold-Christmas-Tree](https://github.com/zhufeng13579-lab/Pink-Gold-Christmas-Tree). The standalone WebGL page is a browser implementation created for Amber's greeting to Max.


## Interactive Christmas shapes

[Open the English shape-changing version](https://ambergao355-bit.github.io/christmas-for-max/magic.html).

- Tree, wreath with red bow, spiral tree, and golden star, with smooth transitions.
- English interface with only “Merry Christmas” as the greeting.
- Shape buttons work without a camera. Optional hand tracking: fist → Tree, open palm → Wreath, pinch → Star.
- Camera video is processed locally. Hand tracking downloads MediaPipe runtime/model files from jsDelivr and Google on request.
- No photos, uploads, accounts or stored camera footage.

Serve this folder over HTTP for local development (`python3 -m http.server 8000`), then open `/magic.html`. Camera access requires localhost or HTTPS.
