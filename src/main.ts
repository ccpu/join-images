import alignImage from './utils/alignImage';
import calcMargin from './utils/calcMargin';
import sharp from 'sharp';
import fs from 'fs';
import isObject from 'is-plain-obj';
import { Options } from './typings';

interface ImageData {
  buffer: Buffer;
  height: number;
  offsetX: number;
  offsetY: number;
  width: number;
  x: number;
  y: number;
}

type InputImage = Buffer | string | ImageSrc;

type ImageSrc = { offsetX?: number; offsetY?: number; src: InputImage };

export async function joinImages(
  images: InputImage[],
  {
    direction = 'vertical',
    color = { alpha: 0.5, b: 0, g: 0, r: 0 },
    align = 'start',
    offset = 0,
    margin,
  }: Options = {},
) {
  if (!Array.isArray(images)) {
    throw new TypeError('`images` must be an array that contains images');
  }

  if (images.length < 1) {
    throw new Error('At least `images` must contain more than one image');
  }

  const processImg = async (img: InputImage): Promise<ImageData> => {
    let imageSrc = img;

    let offsetX = 0;
    let offsetY = 0;
    if (isObject(img)) {
      const { src, offsetX: x = 0, offsetY: y = 0 } = img as ImageSrc;
      offsetX = +x;
      offsetY = +y;
      imageSrc = src;
    }

    const meta = await sharp(imageSrc as string | Buffer).metadata();

    const { width, height } = meta;

    return {
      buffer:
        typeof imageSrc === 'string'
          ? fs.readFileSync(imageSrc)
          : (imageSrc as Buffer),
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

  const imgData = imgs.reduce((res, data) => {
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

  const { top, right, bottom, left } = calcMargin(margin);
  const marginTopBottom = top + bottom;
  const marginRightLeft = right + left;

  const isVertical = direction === 'vertical';

  const totalWidth = isVertical
    ? Math.max(...imgData.map(({ width, offsetX }) => width + offsetX))
    : imgData.reduce(
        (res, { width, offsetX }, index) =>
          res + width + offsetX + Number(index > 0) * offset,
        0,
      );

  const totalHeight = isVertical
    ? imgData.reduce(
        (res, { height, offsetY }, index) =>
          res + height + offsetY + Number(index > 0) * offset,
        0,
      )
    : Math.max(...imgData.map(({ height, offsetY }) => height + offsetY));

  const imageBase = sharp({
    create: {
      background: color as sharp.Color,
      channels: 4,
      height: totalHeight + marginTopBottom,
      width: totalWidth + marginRightLeft,
    },
  });

  const compositeData: sharp.OverlayOptions[] = imgData.map(
    (imgData, index) => {
      const { buffer, x, y, offsetX, offsetY, width, height } = imgData;

      const [px, py] = isVertical
        ? [alignImage(totalWidth, width, align) + offsetX, y + index * offset]
        : [
            x + index * offset,
            alignImage(totalHeight, height, align) + offsetY,
          ];

      return {
        input: buffer,
        left: Math.floor(px + left),
        top: Math.floor(py + top),
      };
    },
  );

  imageBase.composite(compositeData);

  return imageBase;
}

export default joinImages;
