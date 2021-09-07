# join-images

> Merge multiple images into a single image

`join-images` is modified version of [`merge-img`][merge-img] to make it work with [`sharp`][sharp] library.

`join-images` merges given images into a single image in right order. This will be helpful in a situation when you have to generate a preview of multiple images into a single image. This module is based on [`sharp`][sharp] for image processing.

![figure](media/figure.png)
Image credit: https://www.pexels.com/

## Install

```bash
$ npm install sharp join-images
```

```bash
$ yarn add sharp join-images
```

## Usage

```javascript
import joinImages from 'join-images';

joinImages(['image-1.png', 'image-2.jpg']).then((img) => {
  // Save image as file
  img.toFile('out.png');
});
```

## API

### joinImages(images[, options])

- `images` Array of (String | Object | Buffer) - List of images to concat. If `String` is passed, it will be considered to the file path. An `Object` entry can have following options:
  - `src` _`String`_ or `Buffer` - A single image source to concat.
  - `offsetX` Number (optional) - `x` offset to affect this image. Default is `0`.
  - `offsetY` Number (optional) - `y` offset to affect this image. Default is `0`.
- `options` Object (optional)
  - `direction` String (`vertical|horizontal`) - Direction of the merged image.`.
  - `color` (String | Object) - Default background color represented by RGBA hex value. Default is `{ alpha: 0.5, b: 0, g: 0, r: 0 }`.
  - `align` String - Aligning of given images. If the images are not all the same size, images will be sorted to largest image. Possible values are `start`, `center` and `end`. Default is `start`.
  - `offset` Number - Offset in pixels between each image. Default is `0`.
  - `margin` (Number | String | Object) - Margin of the result image. If `Number` or `String` is passed, it will be considered as [standard css shorthand properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties) (e.g. '40 40 0 10'). An `Object` entry can have following options:
    - `top` Number (optional) - Margin on top side of result image. Default is `0`.
    - `right` Number (optional) - Margin on right side of result image. Default is `0`.
    - `bottom` Number (optional) - Margin on bottom side of result image. Default is `0`.
    - `left` Number (optional) - Margin on left side of result image. Default is `0`.

Returns a `Promise` that contains `sharp` object.

[sharp]: https://github.com/lovell/sharp
[merge-img]: https://github.com/preco21/merge-img
