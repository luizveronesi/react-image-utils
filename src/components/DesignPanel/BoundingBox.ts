export type BoundingBoxType = 'rect' | 'circle';

type BoundingBox = {
  uid: string;
  left: number;
  top: number;
  type: BoundingBoxType;
  width?: number;
  height?: number;
  radius?: number;
};

export const EMPTY_BOX = {
  uid: '',
  type: 'rect',
  left: 0,
  top: 0,
};

export default BoundingBox;
