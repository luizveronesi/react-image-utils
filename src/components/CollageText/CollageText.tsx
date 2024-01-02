import { faFont } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef, useState } from 'react';
import { Button, Form, InputGroup, Overlay, Popover } from 'react-bootstrap';
import { HexColorPicker } from 'react-colorful';
import Text, { EMPTY_TEXT } from './Text';
import './style.scss';

const fontFamilies: Record<string, string> = {
  Arial: 'Arial, sans-serif',
  'Arial Black': 'Arial Black, sans-serif',
  'Book Antiqua': 'Book Antiqua, serif',
  'Century Gothic': 'Century Gothic, sans-serif',
  'Courier New': 'Courier New, monospace',
  Garamond: 'Garamond, serif',
  Georgia: 'Georgia, serif',
  Helvetica: 'Helvetica, sans-serif',
  Impact: 'Impact, sans-serif',
  'Lucida Console': 'Lucida Console, monospace',
  Palatino: 'Palatino, serif',
  Tahoma: 'Tahoma, sans-serif',
  'Trebuchet MS': 'Trebuchet MS, sans-serif',
  'Times New Roman': 'Times New Roman, serif',
  Verdana: 'Verdana, sans-serif',
};

type Props = {
  onCreate: (t: Text) => void;
};

export default function CollageText({ onCreate }: Props) {
  const addTextTarget = useRef() as MutableRefObject<HTMLButtonElement>;
  const [text, setText] = useState<Text>(EMPTY_TEXT);
  const [openText, setOpenText] = useState(false);

  return (
    <>
      <Button
        variant="success"
        onClick={() => setOpenText(!openText)}
        ref={addTextTarget}
        title="add text"
      >
        <FontAwesomeIcon icon={faFont} />
      </Button>
      <Overlay placement="left" target={addTextTarget.current} show={openText}>
        <Popover className="popover-text">
          <Popover.Header className="text-center">Add text</Popover.Header>
          <Popover.Body>
            <textarea
              rows={5}
              value={text?.value}
              placeholder="Add your text"
              onChange={(e) => setText({ ...text, value: e.target.value })}
            />
            <InputGroup className="mt-3">
              <Form.Control
                placeholder="Font size (number)"
                value={text?.size}
                onChange={(e) => setText({ ...text, size: e.target.value })}
              />
            </InputGroup>
            <Form.Select
              value={text?.font}
              onChange={(e) => setText({ ...text, font: e.target.value })}
              className="mt-3"
            >
              <option>Choose a font family</option>
              {Object.keys(fontFamilies).map((key) => (
                <option value={fontFamilies[key]} key={key}>
                  {key}
                </option>
              ))}
            </Form.Select>

            <HexColorPicker
              color={text.color}
              onChange={(thisColor) => setText({ ...text, color: thisColor })}
            />

            <div className="buttons">
              <Button
                variant="danger"
                className="me-3"
                onClick={() => setOpenText(false)}
              >
                cancel
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setOpenText(false);
                  onCreate(text);
                }}
              >
                confirm
              </Button>
            </div>
          </Popover.Body>
        </Popover>
      </Overlay>
    </>
  );
}
