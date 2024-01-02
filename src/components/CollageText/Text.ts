import { defaultColor } from '../AppColorpicker/AppColorpicker';

type Text = {
  uid: string;
  value: string;
  font: string;
  size: string;
  color: string;
};

export const EMPTY_TEXT: Text = {
  uid: '',
  value: '',
  font: '',
  size: '',
  color: defaultColor,
};

export default Text;
