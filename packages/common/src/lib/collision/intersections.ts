import { Circle, Line, Polygon, Rect } from '../types';
import {
  isPosInCircle,
  isPosInLine,
  isPosInPolygon,
  isPosInRect,
  squaredDistance,
} from '../utils';

export function intersectLineWithLine(a: Line, b: Line): boolean {
  const denominator =
    (b.end.y - b.start.y) * (a.end.x - a.start.x) -
    (b.end.x - b.start.x) * (a.end.y - a.start.y);

  if (denominator === 0) {
    return false; // Lines are parallel
  }

  const ua =
    ((b.end.x - b.start.x) * (a.start.y - b.start.y) -
      (b.end.y - b.start.y) * (a.start.x - b.start.x)) /
    denominator;

  const ub =
    ((a.end.x - a.start.x) * (a.start.y - b.start.y) -
      (a.end.y - a.start.y) * (a.start.x - b.start.x)) /
    denominator;

  return ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1;
}

export function intersectLineWithPolygon(
  line: Line,
  polygon: Polygon
): boolean {
  // Check if any polygon point is on the line
  for (const point of polygon.points) {
    if (isPosInLine(point, line)) {
      return true;
    }
  }

  // Check if line intersects any polygon edge
  for (let i = 0; i < polygon.points.length; i++) {
    const p1 = polygon.points[i];
    const p2 = polygon.points[(i + 1) % polygon.points.length];
    if (intersectLineWithLine(line, { start: p1, end: p2 })) {
      return true;
    }
  }

  return false;
}

export function intersectRectWithRect(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function intersectRectWithCircle(a: Rect, b: Circle): boolean {
  const closestX = Math.max(a.x, Math.min(b.x, a.x + a.width));
  const closestY = Math.max(a.y, Math.min(b.y, a.y + a.height));

  return isPosInCircle({ x: closestX, y: closestY }, b);
}

export function intersectRectWithPolygon(a: Rect, polygon: Polygon): boolean {
  // Check if any polygon point is inside the rectangle
  for (const point of polygon.points) {
    if (isPosInRect(point, a)) {
      return true;
    }
  }

  // Check if any rectangle corner is inside the polygon
  const rectCorners = [
    { x: a.x, y: a.y },
    { x: a.x + a.width, y: a.y },
    { x: a.x, y: a.y + a.height },
    { x: a.x + a.width, y: a.y + a.height },
  ];
  for (const corner of rectCorners) {
    if (isPosInPolygon(corner, polygon)) {
      return true;
    }
  }

  return false;
}

export function intersectRectWithLine(a: Rect, line: Line): boolean {
  // Check if any rectangle corner is on the line
  const rectCorners = [
    { x: a.x, y: a.y },
    { x: a.x + a.width, y: a.y },
    { x: a.x, y: a.y + a.height },
    { x: a.x + a.width, y: a.y + a.height },
  ];
  for (const corner of rectCorners) {
    if (isPosInLine(corner, line)) {
      return true;
    }
  }
  // Check if line intersects the rectangle edges
  const edges = [
    { start: { x: a.x, y: a.y }, end: { x: a.x + a.width, y: a.y } },
    {
      start: { x: a.x + a.width, y: a.y },
      end: { x: a.x + a.width, y: a.y + a.height },
    },
    {
      start: { x: a.x + a.width, y: a.y + a.height },
      end: { x: a.x, y: a.y + a.height },
    },
    { start: { x: a.x, y: a.y + a.height }, end: { x: a.x, y: a.y } },
  ];
  for (const edge of edges) {
    if (intersectLineWithLine(line, edge)) {
      return true;
    }
  }

  return false;
}

export function intersectCircleWithCircle(a: Circle, b: Circle): boolean {
  const distanceSquared = squaredDistance(a, b);
  const radiusSum = a.radius + b.radius;

  return distanceSquared <= radiusSum * radiusSum;
}

export function intersectCircleWithLine(circle: Circle, line: Line): boolean {
  const p1 = line.start;
  const p2 = line.end;

  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const fx = p1.x - circle.x;
  const fy = p1.y - circle.y;

  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - circle.radius * circle.radius;

  let discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return false;
  }

  discriminant = Math.sqrt(discriminant);
  const t1 = (-b - discriminant) / (2 * a);
  const t2 = (-b + discriminant) / (2 * a);

  if ((t1 >= 0 && t1 <= 1) || (t2 >= 0 && t2 <= 1)) {
    return true;
  }

  return false;
}

export function intersectCircleWithPolygon(
  circle: Circle,
  polygon: Polygon
): boolean {
  // Check if any polygon point is inside the circle
  for (const point of polygon.points) {
    if (isPosInCircle(point, circle)) {
      return true;
    }
  }

  // Check if circle center is inside the polygon
  if (isPosInPolygon({ x: circle.x, y: circle.y }, polygon)) {
    return true;
  }

  // Check if circle intersects any polygon edge
  for (let i = 0; i < polygon.points.length; i++) {
    const p1 = polygon.points[i];
    const p2 = polygon.points[(i + 1) % polygon.points.length];
    if (intersectCircleWithLine(circle, { start: p1, end: p2 })) {
      return true;
    }
  }

  return false;
}

export function intersectPolygonWithPolygon(a: Polygon, b: Polygon): boolean {
  // Check if any polygon point is inside the other polygon
  for (const point of a.points) {
    if (isPosInPolygon(point, b)) {
      return true;
    }
  }

  for (const point of b.points) {
    if (isPosInPolygon(point, a)) {
      return true;
    }
  }

  const edgesA = a.points.reduce((edges, point, index) => {
    const nextPoint = a.points[(index + 1) % a.points.length];
    edges.push({ start: point, end: nextPoint });
    return edges;
  }, [] as Line[]);

  const edgesB = b.points.reduce((edges, point, index) => {
    const nextPoint = b.points[(index + 1) % b.points.length];
    edges.push({ start: point, end: nextPoint });
    return edges;
  }, [] as Line[]);

  // Check if any polygon edge intersects
  for (let i = 0; i < edgesA.length; i++) {
    const edgeA = edgesA[i];
    for (let j = 0; j < edgesB.length; j++) {
      const edgeB = edgesB[j];
      if (intersectLineWithLine(edgeA, edgeB)) {
        return true;
      }
    }
  }

  return false;
}
