import type { Buffer } from 'node:buffer';
import type { Sharp } from 'sharp';
import type { Options } from './typings';
import isObject from 'is-plain-obj';
import sharp from 'sharp';
import alignImage from './utils/alignImage';
import calcMargin from './utils/calcMargin';

interface ImageData {
  buffer: Buffer;
  height: number;
  offsetX: number;
  offsetY: number;
  width: number;
  x: number;
  y: number;
}

type InputSource = Buffer | string | Sharp;

type InputImage = InputSource | ImageSrc;

interface ImageSrc {
  offsetX?: number;
  offsetY?: number;
  src: InputSource;
}

function isSharpInstance(value: InputImage): value is Sharp {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Sharp).clone === 'function' &&
    typeof (value as Sharp).toBuffer === 'function'
  );
}

export async function joinImages(
  images: InputImage[],
  {
    direction = 'vertical',
    color = { alpha: 0.5, b: 0, g: 0, r: 0 },
    align = 'start',
    offset = 0,
    margin,
  }: Options = {},
): Promise<Sharp> {
  if (!Array.isArray(images)) {
    throw new TypeError('`images` must be an array that contains images');
  }

  if (images.length < 1) {
    throw new Error('At least `images` must contain more than one image');
  }

  const processImg = async (img: InputImage): Promise<ImageData> => {
    const {
      offsetX = 0,
      offsetY = 0,
      src,
    } = isObject(img)
      ? (img as ImageSrc)
      : { offsetX: 0, offsetY: 0, src: img as InputSource };
    const imageSrc: InputSource = src;

    const { data: buffer, info } = isSharpInstance(imageSrc)
      ? await imageSrc.clone().toBuffer({ resolveWithObject: true })
      : await sharp(imageSrc).toBuffer({ resolveWithObject: true });

    const { width = 0, height = 0 } = info;

    return {
      buffer,
      height,
      offsetX,
      offsetY,
      width,
      x: 0,
      y: 0,
    };
  };

  const imgs = await Promise.all(images.map(processImg));

  let totalX = 0;
  let totalY = 0;

  const imageData = imgs.reduce((res, data) => {
    const { width, height, offsetY, offsetX } = data;

    res.push({
      ...data,
      x: totalX + offsetX,
      y: totalY + offsetY,
    });

    totalX += width + offsetX;
    totalY += height + offsetY;

    return res;
  }, [] as ImageData[]);

  const { top = 0, right = 0, bottom = 0, left = 0 } = calcMargin(margin);
  const marginTopBottom = top + bottom;
  const marginRightLeft = right + left;

  const isVertical = direction === 'vertical';

  const totalWidth = isVertical
    ? Math.max(...imageData.map(({ width, offsetX }) => width + offsetX))
    : imageData.reduce(
        (res, { width, offsetX }, index) =>
          res + width + offsetX + Number(index > 0) * offset,
        0,
      );

  const totalHeight = isVertical
    ? imageData.reduce(
        (res, { height, offsetY }, index) =>
          res + height + offsetY + Number(index > 0) * offset,
        0,
      )
    : Math.max(...imageData.map(({ height, offsetY }) => height + offsetY));

  const imageBase = sharp({
    create: {
      background: color,
      channels: 4,
      height: totalHeight + marginTopBottom,
      width: totalWidth + marginRightLeft,
    },
  });

  const compositeData: sharp.OverlayOptions[] = imageData.map((image, index) => {
    const { buffer, x, y, offsetX, offsetY, width, height } = image;

    const [px, py] = isVertical
      ? [alignImage(totalWidth, width, align) + offsetX, y + index * offset]
      : [x + index * offset, alignImage(totalHeight, height, align) + offsetY];

    return {
      input: buffer,
      left: Math.floor(px + left),
      top: Math.floor(py + top),
    };
  });

  imageBase.composite(compositeData);

  return imageBase;
}

export default joinImages;
