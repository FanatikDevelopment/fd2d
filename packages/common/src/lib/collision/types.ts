import { Pos } from '../types';

export const ShapeNames = ['circle', 'rectangle', 'polygon', 'line'] as const;
export type ShapeName = (typeof ShapeNames)[number] | (string & {});

export interface ICollider {
  type: ShapeName;
  contains(pos: Pos): boolean;
  intersects(other: ICollider): boolean;
}
