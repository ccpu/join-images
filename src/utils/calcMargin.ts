interface Dim {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export default function calcMargin(obj: Dim | string | number = {}): Dim {
  if (Number.isInteger(obj as number)) {
    return {
      bottom: obj as number,
      left: obj as number,
      right: obj as number,
      top: obj as number,
    };
  }

  if (typeof obj === 'string') {
    const [top, right = top, bottom = top, left = right] = obj.split(' ');

    return {
      bottom: Number(bottom),
      left: Number(left),
      right: Number(right),
      top: Number(top),
    };
  }

  const { top = 0, right = 0, bottom = 0, left = 0 } = obj as Dim;

  return {
    bottom,
    left,
    right,
    top,
  };
}
