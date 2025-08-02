import { Polygon, Pos } from '../types';
import { isPosInPolygon } from '../utils';
import { CircleCollider } from './CircleCollider';
import {
  intersectLineWithPolygon,
  intersectCircleWithPolygon,
  intersectPolygonWithPolygon,
  intersectRectWithPolygon,
} from './intersections';
import { LineCollider } from './LineCollider';
import { RectCollider } from './RectCollider';
import { ICollider, ShapeName } from './types';

export class PolygonCollider implements ICollider {
  public type: ShapeName = 'polygon';

  public polygon: Polygon;

  constructor(polygon: Polygon) {
    this.polygon = polygon;
  }

  public contains(pos: Pos): boolean {
    return isPosInPolygon(pos, this.polygon);
  }

  intersects(other: ICollider): boolean {
    switch (other.type) {
      case 'polygon':
        return intersectPolygonWithPolygon(
          this.polygon,
          (other as PolygonCollider).polygon
        );
      case 'line':
        return intersectLineWithPolygon(
          (other as LineCollider).line,
          this.polygon
        );
      case 'circle':
        return intersectCircleWithPolygon(
          (other as CircleCollider).circle,
          this.polygon
        );
      case 'rectangle':
        return intersectRectWithPolygon(
          (other as RectCollider).rect,
          this.polygon
        );
      default:
        return other.intersects(this);
    }
  }
}
