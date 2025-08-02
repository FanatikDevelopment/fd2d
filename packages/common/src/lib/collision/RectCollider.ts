import { Pos, Rect } from '../types';
import { isPosInRect } from '../utils';
import { CircleCollider } from './CircleCollider';
import {
  intersectRectWithCircle,
  intersectRectWithLine,
  intersectRectWithPolygon,
  intersectRectWithRect,
} from './intersections';
import { LineCollider } from './LineCollider';
import { PolygonCollider } from './PolygonCollider';
import { ICollider, ShapeName } from './types';

export class RectCollider implements ICollider {
  public type: ShapeName = 'rectangle';

  public rect: Rect;

  constructor(rect: Rect) {
    this.rect = rect;
  }

  public contains(pos: Pos): boolean {
    return isPosInRect(pos, this.rect);
  }

  intersects(other: ICollider): boolean {
    switch (other.type) {
      case 'rectangle':
        return intersectRectWithRect(this.rect, (other as RectCollider).rect);
      case 'circle':
        return intersectRectWithCircle(
          this.rect,
          (other as CircleCollider).circle
        );
      case 'polygon':
        return intersectRectWithPolygon(
          this.rect,
          (other as PolygonCollider).polygon
        );
      case 'line':
        return intersectRectWithLine(this.rect, (other as LineCollider).line);
      default:
        return other.intersects(this);
    }
  }
}
