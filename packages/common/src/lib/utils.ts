import type { Circle, Line, Polygon, Pos } from './types';

export function squaredDistance(a: Pos, b: Pos): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

export function distance(a: Pos, b: Pos): number {
  return Math.sqrt(squaredDistance(a, b));
}

export function manhattanDistance(a: Pos, b: Pos): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function isPosEqual(a: Pos, b: Pos): boolean {
  return (
    Math.abs(a.x - b.x) < Number.EPSILON && Math.abs(a.y - b.y) < Number.EPSILON
  );
}

export function isPosInRect(
  pos: Pos,
  rect: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    pos.x >= rect.x &&
    pos.x < rect.x + rect.width &&
    pos.y >= rect.y &&
    pos.y < rect.y + rect.height
  );
}

export function isPosInCircle(pos: Pos, circle: Circle): boolean {
  return (
    squaredDistance(pos, { x: circle.x, y: circle.y }) <= circle.radius ** 2
  );
}

export function isPosInPolygon(pos: Pos, polygon: Polygon): boolean {
  let inside = false;
  const n = polygon.points.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon.points[i].x;
    const yi = polygon.points[i].y;
    const xj = polygon.points[j].x;
    const yj = polygon.points[j].y;

    if (yi > pos.y === yj > pos.y) {
      continue;
    }

    const v = { x: xj - xi, y: yj - yi };

    const intersect = pos.x < (v.x * (pos.y - yi)) / v.y + xi;

    if (intersect) {
      inside = !inside;
    }
  }

  return inside;
}

export function isPosInLine(pos: Pos, line: Line): boolean {
  const { start, end } = line;
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (dx === 0 && dy === 0) {
    return isPosEqual(pos, start);
  }

  const t =
    ((pos.x - start.x) * dx + (pos.y - start.y) * dy) / (dx * dx + dy * dy);

  if (t < 0 || t > 1) {
    return false;
  }

  const closestPoint = {
    x: start.x + t * dx,
    y: start.y + t * dy,
  };

  return isPosEqual(pos, closestPoint);
}
