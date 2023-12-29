import {
  faDownload,
  faFont,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef, useState } from 'react';
import { Button, Form, InputGroup, Overlay, Popover } from 'react-bootstrap';
import { exportComponentAsJPEG } from 'react-component-export-image';
import { Rnd } from 'react-rnd';
import AppDropzone from '../AppDropzone';
import { UploadedImage } from '../AppDropzone/UploadedImage';
import Text, { EMPTY_TEXT } from './Text';
import './style.scss';
import AppColorpicker from '../AppColorpicker';

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

const downloadFilename = 'react-image-utils.jpg';

export default function CollagePanel() {
  const downloadTarget = useRef() as MutableRefObject<HTMLDivElement>;
  const addTextTarget = useRef() as MutableRefObject<HTMLButtonElement>;
  const [text, setText] = useState<Text>();
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [texts, setTexts] = useState<Text[]>([]);

  const changeBackground = (color: string) => {
    setBackgroundColor(color);
  };

  const handleAddText = () => {
    text && setTexts((prevState) => [...prevState, text]);
    setText(undefined);
  };

  const handleUpload = (thisUpload: UploadedImage) => {
    setUploaded((prevState) => [...prevState, thisUpload]);
  };

  const handleRemove = (idx: number) => {
    uploaded.splice(idx, 1);
    setUploaded([...uploaded]);
  };

  const handleDownloadImage = () => {
    exportComponentAsJPEG(downloadTarget, { fileName: downloadFilename });
  };

  const handleClickImage = (e: any, idx: number) => {
    // on the double click
    if (e.detail !== 2) return;
    console.log(idx);
  };

  return (
    <div className="collate-container">
      {uploaded.length === 0 ? (
        <AppDropzone setUploaded={handleUpload} />
      ) : (
        <>
          <div
            className="image-wrapper"
            ref={downloadTarget}
            style={{ backgroundColor: backgroundColor }}
          >
            {uploaded.map((up, idx) => (
              <Rnd
                style={{ zIndex: up.zIndex }}
                onClick={(e: any) => handleClickImage(e, idx)}
                key={`img_${idx.valueOf()}`}
              >
                <img src={up.url} />
              </Rnd>
            ))}
            {texts.map((text, idx) => (
              <Rnd
                style={{ zIndex: idx }}
                onClick={handleClickImage}
                key={`text_${idx.valueOf()}`}
              >
                <span
                  style={{ fontFamily: text.font, fontSize: `${text.size}px` }}
                >
                  {text.value}
                </span>
              </Rnd>
            ))}
          </div>
          <div className="toolbox">
            <h5>Gallery</h5>
            {uploaded.map((up, idx) => (
              <div className="gallery" key={idx.valueOf()}>
                <button type="button" onClick={() => handleRemove(idx)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
                <img src={up.url} />
              </div>
            ))}
            <hr />
            <h5>Actions</h5>
            <AppDropzone setUploaded={handleUpload}>
              <FontAwesomeIcon icon={faUpload} />
            </AppDropzone>

            <Button
              variant="success"
              onClick={() => setText(EMPTY_TEXT)}
              ref={addTextTarget}
              title="add text"
            >
              <FontAwesomeIcon icon={faFont} />
            </Button>

            <AppColorpicker onChange={changeBackground} />

            <Button onClick={handleDownloadImage} title="download collation">
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </div>
        </>
      )}

      {text && (
        <Overlay placement="left" target={addTextTarget.current} show>
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

              <div className="buttons">
                <Button
                  variant="danger"
                  className="me-3"
                  onClick={() => setText(undefined)}
                >
                  cancel
                </Button>
                <Button variant="success" onClick={handleAddText}>
                  confirm
                </Button>
              </div>
            </Popover.Body>
          </Popover>
        </Overlay>
      )}
    </div>
  );
}
