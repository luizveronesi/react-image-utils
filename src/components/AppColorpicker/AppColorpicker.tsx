import { MutableRefObject, useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { HexColorInput, HexColorPicker } from 'react-colorful';
import './style.scss';

export const defaultColor = '#000000';

type AppColorpickerProps = {
  onChange: (value: string) => void;
};

export default function AppColorpicker({ onChange }: AppColorpickerProps) {
  const target = useRef() as MutableRefObject<HTMLDivElement>;
  const [openColor, setOpenColor] = useState(false);
  const [color, setColor] = useState(defaultColor);

  return (
    <div className="color-picker-container">
      <div
        className="swatch"
        style={{ backgroundColor: color }}
        onClick={() => setOpenColor(!openColor)}
        onKeyDown={() => setOpenColor(!openColor)}
        ref={target}
      />
      {openColor && (
        <Overlay placement="left" target={target.current} show>
          <Popover className="popover-color">
            <Popover.Header className="text-center">
              Change background color
            </Popover.Header>
            <Popover.Body>
              <div className="picker">
                <HexColorPicker color={color} onChange={setColor} />
                <HexColorInput
                  color={color}
                  onChange={setColor}
                  className="input-color"
                />
                <div className="buttons">
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setOpenColor(false)}
                  >
                    cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => {
                      onChange(color);
                      setOpenColor(false);
                    }}
                  >
                    apply
                  </Button>
                </div>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>
      )}
    </div>
  );
}
