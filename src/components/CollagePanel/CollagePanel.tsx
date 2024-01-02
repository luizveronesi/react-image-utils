import {
  faDownload,
  faTrash,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MutableRefObject, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { exportComponentAsJPEG } from 'react-component-export-image';
import { Rnd } from 'react-rnd';
import AppColorpicker from '../AppColorpicker';
import AppDropzone from '../AppDropzone';
import { UploadedImage } from '../AppDropzone/UploadedImage';
import CollageText from '../CollageText';
import Text from '../CollageText/Text';
import './style.scss';

const downloadFilename = 'react-image-utils.jpg';

export default function CollagePanel() {
  const downloadTarget = useRef() as MutableRefObject<HTMLDivElement>;
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [uploaded, setUploaded] = useState<UploadedImage[]>([]);
  const [texts, setTexts] = useState<Text[]>([]);

  const handleAddText = (text: Text) => {
    setTexts((prevState) => [...prevState, text]);
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
                style={{ zIndex: idx, color: text.color }}
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

            <CollageText onCreate={handleAddText} />

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
