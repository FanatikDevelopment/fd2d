export type Pos = {
  x: number;
  y: number;
};

export function isPos(pos: unknown): pos is Pos {
  return (
    typeof pos === 'object' &&
    typeof (pos as Pos).x === 'number' &&
    typeof (pos as Pos).y === 'number'
  );
}

export type Size = {
  width: number;
  height: number;
};

export function isSize(size: unknown): size is Size {
  return (
    typeof size === 'object' &&
    typeof (size as Size).width === 'number' &&
    typeof (size as Size).height === 'number'
  );
}

export type Rect = Pos & Size;

export function isRect(rect: unknown): rect is Rect {
  return isPos(rect) && isSize(rect);
}

export type Circle = Pos & {
  radius: number;
};

export function isCircle(circle: unknown): circle is Circle {
  return (
    typeof circle === 'object' &&
    isPos(circle) &&
    typeof (circle as Circle).radius === 'number'
  );
}

export type Polygon = {
  points: Pos[];
};

export function isPolygon(polygon: unknown): polygon is Polygon {
  return (
    typeof polygon === 'object' &&
    Array.isArray((polygon as Polygon).points) &&
    (polygon as Polygon).points.every(isPos)
  );
}

export type Line = {
  start: Pos;
  end: Pos;
};

export function isLine(line: unknown): line is Line {
  return (
    typeof line === 'object' &&
    isPos((line as Line).start) &&
    isPos((line as Line).end)
  );
}
