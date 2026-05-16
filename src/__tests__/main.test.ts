import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { imageMatcher } from 'vitest-image-snapshot';
import joinImage from '../main';

imageMatcher();

const snapshotName = (suffix: string) => `main-test-ts-sharp-${suffix}-1-snap`;

describe('sharp', () => {
  const fixturePath = path.join(__dirname, './fixtures/example.png');
  const imageBuffer = fs.readFileSync(fixturePath);
  const imageBuffer2 = fs.readFileSync(fixturePath);

  it('should throw if input is not array', async () => {
    await expect(joinImage({} as never)).rejects.toThrowError(
      '`images` must be an array that contains images',
    );
  });

  it('should throw if input is has not value', async () => {
    await expect(joinImage([])).rejects.toThrowError(
      'At least `images` must contain more than one image',
    );
  });

  it('accepts correct path type', async () => {
    await expect(joinImage([fixturePath, fixturePath])).resolves.toBeDefined();
  }, 100);

  it('returns `Promise` that contains `sharp` object', async () => {
    const image = await joinImage([imageBuffer, imageBuffer2]);
    expect(image instanceof sharp).toBeTruthy();
  }, 100);

  it('handles options', async () => {
    const image = await joinImage([imageBuffer, imageBuffer2], {
      align: 'center',
      color: '#ffffff',
      direction: 'horizontal',
      offset: 10,
    });

    expect(image instanceof sharp).toBeTruthy();
  }, 100);

  it('should join 3 images', async () => {
    const imageBuffer3 = fs.readFileSync(fixturePath);
    const imageBase = await joinImage([imageBuffer, imageBuffer2, imageBuffer3]);
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-join-3-images'),
    );
  });

  it('should generate vertical image', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2]);
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-generate-vertical-image'),
    );
  });

  it('should handles offsets per image individually', async () => {
    const imageBase = await joinImage([
      { offsetX: 10, offsetY: 10, src: imageBuffer },
      { offsetX: 20, offsetY: 50, src: imageBuffer },
    ]);
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-handles-offsets-per-image-individually'),
    );
  });

  it('should handles undefined offset', async () => {
    const imageBase = await joinImage([
      { offsetX: 50, src: imageBuffer },
      { offsetY: 50, src: imageBuffer },
    ]);
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-handles-undefined-offset'),
    );
  });

  it('should generate horizontal image', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      direction: 'horizontal',
    });
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-generate-horizontal-image'),
    );
  });

  it('should have offset', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      offset: 20,
    });
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-have-offset'),
    );
  });

  it('handles the image margin with number option', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      margin: 20,
    });
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('handles-the-image-margin-with-number-option'),
    );
  });

  it('handles the image margin with string option', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      margin: '40 40 0 10',
    });
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('handles-the-image-margin-with-string-option'),
    );
  });

  it('handles the image margin with object option', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      margin: {
        bottom: 0,
        left: 10,
        right: 40,
        top: 40,
      },
    });
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('handles-the-image-margin-with-object-option'),
    );
  });

  it('should handle decimal position', async () => {
    const buffer3x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAMAAAABCAQAAACx6dw/AAAADUlEQVR42mNk+M8ABAAFCQEBRpvUyAAAAABJRU5ErkJggg==',
      'base64',
    );
    const buffer2x1 = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mNk+M/AAAADBwEBPuJ7gwAAAABJRU5ErkJggg==',
      'base64',
    );
    const imageBase = await joinImage([buffer3x1, buffer2x1], {
      align: 'center',
    });
    await expect(await imageBase.png().toBuffer()).toMatchImage(
      snapshotName('should-handle-decimal-position'),
    );
  });
});
