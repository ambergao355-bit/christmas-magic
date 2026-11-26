# Christmas Magic

An interactive Christmas greeting. The only greeting displayed is **Merry Christmas**.

[Open the interactive page](https://ambergao355-bit.github.io/christmas-magic/)

## Shapes

- **Tree**: natural green pine branches, warm white lights, champagne ribbons and silver/gold ornaments.
- **Wreath**: pine foliage with red, blush pink and pale blue bows, plus gold stars.
- **Spiral**: the original full green particle tree with red spiral light ribbons and orange ornaments.
- **Star**: a golden particle star.

Choose a shape with the buttons. Drag to rotate and scroll to zoom. Optional camera gestures: fist → Tree, open palm → Wreath, pinch → Star. Camera video is processed locally; hand tracking downloads MediaPipe runtime/model files from jsDelivr and Google when enabled.

## Run locally

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/`. Camera access requires localhost or HTTPS. No photos or uploads are used.

Direct links can select a starting shape: `?shape=tree`, `?shape=wreath`, `?shape=spiral`, or `?shape=star`. The `/magic.html` path also works.

## Source

The original Python animation was adapted from [Pink-Gold-Christmas-Tree](https://github.com/zhufeng13579-lab/Pink-Gold-Christmas-Tree). The browser implementation adds procedural pine geometry, satin ribbons, metallic decorations, particle transformations and optional MediaPipe hand tracking. Reference photos inform the design and are not embedded or uploaded.
