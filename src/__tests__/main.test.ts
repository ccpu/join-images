// import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import joinImage from '../main';
import { toMatchImageSnapshot } from 'jest-image-snapshot';
import sharp from 'sharp';
expect.extend({ toMatchImageSnapshot });

describe('sharp', () => {
  const fixturePath = path.join(__dirname, './fixtures/example.png');
  const imageBuffer = fs.readFileSync(fixturePath);
  const imageBuffer2 = fs.readFileSync(fixturePath);

  it('should throw if input is not array', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await expect(joinImage({})).rejects.toThrowError(
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

  test('returns `Promise` that contains `sharp` object', async () => {
    const image = await joinImage([imageBuffer, imageBuffer2]);
    expect(image instanceof sharp).toBeTruthy();
  }, 100);

  test('handles options', async () => {
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
    const imageBase = await joinImage([
      imageBuffer,
      imageBuffer2,
      imageBuffer3,
    ]);
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('should generate vertical image', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2]);
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('should handles offsets per image individually', async () => {
    const imageBase = await joinImage([
      { offsetX: 10, offsetY: 10, src: imageBuffer },
      { offsetX: 20, offsetY: 50, src: imageBuffer },
    ]);
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('should handles undefined offset', async () => {
    const imageBase = await joinImage([
      { offsetX: 50, src: imageBuffer },
      { offsetY: 50, src: imageBuffer },
    ]);
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('should generate horizontal image', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      direction: 'horizontal',
    });
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('should have offset', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      offset: 20,
    });
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('handles the image margin with number option', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      margin: 20,
    });
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });

  it('handles the image margin with string option', async () => {
    const imageBase = await joinImage([imageBuffer, imageBuffer2], {
      margin: '40 40 0 10',
    });
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
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
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
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
    expect(await imageBase.png().toBuffer()).toMatchImageSnapshot();
  });
});
