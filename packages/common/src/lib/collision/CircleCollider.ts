import { Circle, Pos } from '../types';
import { isPosInCircle } from '../utils';
import {
  intersectCircleWithCircle,
  intersectCircleWithLine,
  intersectCircleWithPolygon,
  intersectRectWithCircle,
} from './intersections';
import { LineCollider } from './LineCollider';
import { PolygonCollider } from './PolygonCollider';
import { RectCollider } from './RectCollider';
import { ICollider, ShapeName } from './types';

export class CircleCollider implements ICollider {
  public type: ShapeName = 'circle';

  public circle: Circle;

  constructor(circle: Circle) {
    this.circle = circle;
  }

  public contains(pos: Pos): boolean {
    return isPosInCircle(pos, this.circle);
  }

  intersects(other: ICollider): boolean {
    switch (other.type) {
      case 'circle':
        return intersectCircleWithCircle(
          this.circle,
          (other as CircleCollider).circle
        );
      case 'line':
        return intersectCircleWithLine(
          this.circle,
          (other as LineCollider).line
        );
      case 'polygon':
        return intersectCircleWithPolygon(
          this.circle,
          (other as PolygonCollider).polygon
        );
      case 'rectangle':
        return intersectRectWithCircle(
          (other as RectCollider).rect,
          this.circle
        );
      default:
        return other.intersects(this);
    }
  }
}
