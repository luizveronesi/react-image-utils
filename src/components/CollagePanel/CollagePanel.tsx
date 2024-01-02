import {
  faDownload,
  faFont,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { exportComponentAsJPEG } from 'react-component-export-image';
import { Rnd } from 'react-rnd';
import { v4 as uuidv4 } from 'uuid';
import AppColorpicker from '../AppColorpicker';
import AppDropzone from '../AppDropzone';
import { UploadedImage } from '../AppDropzone/UploadedImage';
import CollageText from '../CollageText';
import Text, { EMPTY_TEXT } from '../CollageText/Text';
import './style.scss';

const downloadFilename = 'react-image-utils.jpg';

export default function CollagePanel() {
  const addTextTarget = useRef() as MutableRefObject<HTMLButtonElement>;
  const downloadTarget = useRef() as MutableRefObject<HTMLDivElement>;
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [openText, setOpenText] = useState(false);
  const [texts, setTexts] = useState<Text[]>([]);
  const [text, setText] = useState<Text>(EMPTY_TEXT);

  const handleRemoveText = (thisText: Text) => {
    setTexts(texts.filter((item) => item.uid !== thisText.uid));
    setOpenText(false);
  };

  const handleChangeText = (thisText: Text) => {
    if (!thisText.uid) {
      thisText.uid = uuidv4();
      setTexts((prevState) => [...prevState, thisText]);
    } else {
      setTexts(
        texts.map((item) =>
          item.uid === thisText.uid ? { ...thisText } : item
        )
      );
    }

    setOpenText(false);
  };

  const changeBackground = (color: string) => {
    setBackgroundColor(color);
  };

  const handleUpload = (thisUpload: UploadedImage) => {
    thisUpload.zIndex = uploaded.length;
    setUploaded((prevState) => [...prevState, thisUpload]);
  };

  const handleRemove = (idx: number) => {
    uploaded.splice(idx, 1);
    setUploaded([...uploaded]);
  };

  const handleDownloadImage = () => {
    exportComponentAsJPEG(downloadTarget, { fileName: downloadFilename });
  };

  // on the double click send the image to the background
  const handleClickImage = (e: any, idx: number) => {
    if (e.detail !== 2) return;

    let firstZidx = 0;
    uploaded.forEach((u, i) => {
      if (i === idx) {
        u.zIndex = 0;
      } else {
        firstZidx += 1;
        u.zIndex = firstZidx;
      }
    });
    setUploaded([...uploaded]);
  };

  const handleClickText = (e: any, idx: number) => {
    if (e.detail !== 2) return;
    setText(texts[idx]);
    setOpenText(true);
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
                bounds=".image-wrapper"
                onDragStart={(event) => {
                  event.preventDefault();
                }}
              >
                <img src={up.url} />
              </Rnd>
            ))}
            {texts.map((text, idx) => (
              <Rnd
                style={{ zIndex: idx, color: text.color }}
                onClick={(e: any) => handleClickText(e, idx)}
                key={`text_${idx.valueOf()}`}
                bounds={downloadTarget.current}
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
              onClick={() => {
                setOpenText(!openText);
                setText(EMPTY_TEXT);
              }}
              ref={addTextTarget}
              title="add text"
            >
              <FontAwesomeIcon icon={faFont} />
            </Button>
            <Overlay
              placement="left"
              target={addTextTarget.current}
              show={openText}
            >
              <Popover className="popover-text">
                <Popover.Header className="text-center">
                  Add text
                </Popover.Header>
                <Popover.Body>
                  <CollageText
                    onChange={handleChangeText}
                    onRemove={handleRemoveText}
                    onClose={() => setOpenText(false)}
                    text={text}
                  />
                </Popover.Body>
              </Popover>
            </Overlay>

            <AppColorpicker onChange={changeBackground} />

            <Button onClick={handleDownloadImage} title="download collation">
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
