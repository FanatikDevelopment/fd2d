import { Line, Pos } from '../types';
import { isPosInLine } from '../utils';
import { CircleCollider } from './CircleCollider';
import {
  intersectLineWithLine,
  intersectLineWithPolygon,
  intersectCircleWithLine,
  intersectRectWithLine,
} from './intersections';
import { PolygonCollider } from './PolygonCollider';
import { RectCollider } from './RectCollider';
import { ICollider, ShapeName } from './types';

export class LineCollider implements ICollider {
  public type: ShapeName = 'line';

  public line: Line;

  constructor(line: Line) {
    this.line = line;
  }

  public contains(pos: Pos): boolean {
    return isPosInLine(pos, this.line);
  }

  intersects(other: ICollider): boolean {
    switch (other.type) {
      case 'line':
        return intersectLineWithLine(this.line, (other as LineCollider).line);
      case 'circle':
        return intersectCircleWithLine(
          (other as CircleCollider).circle,
          this.line
        );
      case 'polygon':
        return intersectLineWithPolygon(
          this.line,
          (other as PolygonCollider).polygon
        );
      case 'rectangle':
        return intersectRectWithLine((other as RectCollider).rect, this.line);
      default:
        return other.intersects(this);
    }
  }
}
