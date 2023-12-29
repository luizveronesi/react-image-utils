import BoundingBox, {
  BoundingBoxType,
} from '@/components/DesignPanel/BoundingBox';
import { useEffect, useRef, useState } from 'react';
import { Button, Overlay, Popover } from 'react-bootstrap';
import { UploadedImage } from '../AppDropzone/UploadedImage';
import DesignUtils from './DesignUtils';
import './style.scss';
import './svg.select.scss';
import AppDropzone from '../AppDropzone';

export default function DesignPanel() {
  const target = useRef(document.createElement('rect'));
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [zoomInstance, setZoomInstance] = useState<any>();
  const [uploaded, setUploaded] = useState<UploadedImage>();
  const [addConfirm, setAddConfirm] = useState(false);
  const [tool, setTool] = useState<BoundingBoxType>();
  const [addedBox, setAddedBox] = useState<BoundingBox | null>(null);
  const [viewBox, setViewBox] = useState('');

  const handleSelectTool = (selected: BoundingBoxType) => {
    if (tool && tool === selected) {
      setTool(undefined);
      return;
    }

    setTool(selected);
    DesignUtils.draw(selected, handleAddBox);
  };

  const handleAddBox = (thisBox: BoundingBox, node: any) => {
    target.current = node;
    setAddedBox(thisBox);
    setAddConfirm(true);
  };

  const handleConfirm = () => {
    if (!addedBox) return;
    setAddConfirm(false);
    target.current.remove();
    target.current = document.createElement('rect');
    setBoxes([...boxes, addedBox]);
    setTool(undefined);
  };

  const handleUnconfirm = () => {
    setAddConfirm(false);
    setAddedBox(null);
    target.current.remove();
    target.current = document.createElement('rect');
  };

  const handleChange = (data: any, theseBoxes: BoundingBox[]) => {
    const thisBox = theseBoxes.filter((b) => b.uid === data.uid)[0];
    thisBox.top = data.top;
    thisBox.left = data.left;
    thisBox.width = data.width;
    thisBox.height = data.height;
  };

  const initDesign = () => {
    !zoomInstance && setZoomInstance(DesignUtils.zoom());
    DesignUtils.resize((data: any) => handleChange(data, boxes));
    DesignUtils.drag((data: any) => handleChange(data, boxes));

    document.addEventListener('contextmenu', (event: any) => {
      event.preventDefault();
    });
  };

  const handleClickBox = (event: any, thisBox: BoundingBox) => {
    switch (event.detail) {
      case 2: {
        alert(JSON.stringify(thisBox));
        break;
      }
      default:
        break;
    }
  };

  useEffect(() => {
    uploaded && setViewBox(`0 0 ${uploaded.width} ${uploaded.height}`);
  }, [uploaded]);

  useEffect(() => {
    viewBox && initDesign();
  }, [viewBox, boxes]);

  return (
    <div className="design-container">
      {!uploaded && <AppDropzone setUploaded={setUploaded} />}
      {uploaded && viewBox && (
        <>
          <svg
            width="100%"
            height="100%"
            id="image-design"
            viewBox={viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            <image
              width={uploaded.width}
              height={uploaded.height}
              x={0}
              y={0}
              xlinkHref={uploaded.url}
            />

            <rect
              className="design-image"
              width={uploaded.width}
              height={uploaded.height}
              x={0}
              y={0}
            />

            {boxes.length > 0 &&
              boxes.map((thisBox: BoundingBox, idx) => (
                <g
                  className="box"
                  onClick={(event: any) => handleClickBox(event, thisBox)}
                  key={idx.valueOf()}
                >
                  {thisBox.type === 'rect' && (
                    <rect
                      className="box-inner"
                      x={thisBox.left}
                      y={thisBox.top}
                      width={thisBox.width}
                      height={thisBox.height}
                      data-uid={thisBox.uid}
                    />
                  )}
                  {thisBox.type === 'circle' && (
                    <circle
                      className="box-inner"
                      cx={thisBox.left}
                      cy={thisBox.top}
                      r={thisBox.radius}
                      data-uid={thisBox.uid}
                    />
                  )}
                </g>
              ))}
          </svg>
          <div className="toolbox">
            <h5>Toolbox</h5>
            <button
              type="button"
              onClick={() => handleSelectTool('rect')}
              className={`design-rect ${
                tool && tool === 'rect' ? 'active' : ''
              }`}
            />
            <button
              type="button"
              onClick={() => handleSelectTool('circle')}
              className={`design-circle ${
                tool && tool === 'circle' ? 'active' : ''
              }`}
            />
          </div>
        </>
      )}

      <Overlay placement="left" target={target.current} show={addConfirm}>
        <Popover className="popover-confirm">
          <Popover.Header className="text-center">
            Confirm inclusion?
          </Popover.Header>
          <Popover.Body>
            <Button variant="danger" className="me-3" onClick={handleUnconfirm}>
              cancel
            </Button>
            <Button variant="success" onClick={handleConfirm}>
              confirm
            </Button>
          </Popover.Body>
        </Popover>
      </Overlay>
    </div>
  );
}
