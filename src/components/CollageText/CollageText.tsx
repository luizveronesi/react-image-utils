import { faCheck, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { HexColorPicker } from 'react-colorful';
import Text from './Text';
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
  text: Text;
  onChange: (t: Text) => void;
  onRemove: (t: Text) => void;
  onClose: () => void;
};

export default function CollageText({
  text,
  onChange,
  onClose,
  onRemove,
}: Props) {
  const [localText, setLocalText] = useState<Text>(text);

  return (
    <div className="collage-text-container">
      <textarea
        rows={5}
        value={localText?.value}
        placeholder="Add your text"
        onChange={(e) => setLocalText({ ...localText, value: e.target.value })}
      />
      <InputGroup className="mt-3">
        <Form.Control
          placeholder="Font size (number)"
          value={localText?.size}
          onChange={(e) => setLocalText({ ...localText, size: e.target.value })}
        />
      </InputGroup>
      <Form.Select
        value={localText?.font}
        onChange={(e) => setLocalText({ ...localText, font: e.target.value })}
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
        color={localText.color}
        onChange={(thisColor) =>
          setLocalText({ ...localText, color: thisColor })
        }
      />

      <div className="buttons">
        {text.uid && (
          <Button
            variant="danger"
            onClick={() => onRemove(text)}
            className="me-3"
          >
            <FontAwesomeIcon icon={faTrash} />
            <span className="ms-2">remove</span>
          </Button>
        )}
        <Button variant="primary" onClick={onClose} className="me-3">
          <FontAwesomeIcon icon={faTimes} />
          <span className="ms-2">close</span>
        </Button>
        <Button
          variant="success"
          onClick={() => {
            onChange(localText);
          }}
        >
          <FontAwesomeIcon icon={faCheck} />
          <span className="ms-2">confirm</span>
        </Button>
      </div>
    </div>
  );
}
