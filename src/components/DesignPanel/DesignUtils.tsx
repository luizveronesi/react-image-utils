// https://codesandbox.io/s/8717w
import SVG from 'svg.js';
import 'svg.draw.js';
import 'svg.select.js';
import 'svg.resize.js';
import { SVG as dotSVG } from '@svgdotjs/svg.js';
import '@svgdotjs/svg.panzoom.js';
import '@svgdotjs/svg.draggable.js';
import { v4 as uuidv4 } from 'uuid';
import BoundingBox, {
  BoundingBoxType,
} from '@/components/DesignPanel/BoundingBox';

const IMAGE_CONTAINER = 'image-design';
const INITIAL_ZOOM = 0.2;

const drag = (handleDrag: (position: any) => void) => {
  const svg: any = dotSVG(`#${IMAGE_CONTAINER}`);
  svg.find('.box-inner').map((rect: any) => {
    rect.draggable().on('dragend', (event: any) => {
      handleDrag(convertDimension(event.target));
    });
  });
};

const resize = (handleResize: (position: any) => void) => {
  const svg = SVG(IMAGE_CONTAINER);
  svg
    .select('.box-inner')
    .selectize({ pointSize: 20, rotationPoint: false })
    .resize()
    .on('resizedone', (e: any) => handleResize(convertDimension(e.target)));
};

const reset = (viewBox: string, zoomInstance: any) => {
  const svgElement: any = document.getElementById(IMAGE_CONTAINER);
  svgElement.setAttribute('viewBox', viewBox);
  zoomInstance.zoom(INITIAL_ZOOM);
};

const zoom = (): any => {
  // returns the canvas to be used in automatic zooming
  const svg: any = dotSVG(`#${IMAGE_CONTAINER}`);
  const instance = svg.panZoom({ zoomFactor: 0.1, panButton: 2 });
  instance.zoom(INITIAL_ZOOM);
  return instance;
};

const convertDimension = (element: any) => {
  const bound = element.getBBox();
  const positions = screenToSVG(element);
  return {
    uid: element.dataset.uid,
    left: positions.x,
    top: positions.y,
    width: bound.width,
    height: bound.height,
  };
};

const screenToSVG = (element: any) => {
  const svg: any = document.getElementById('image-design');
  const bound = element.getBoundingClientRect();
  const p = svg.createSVGPoint();
  p.x = bound.x;
  p.y = bound.y;
  return p.matrixTransform(svg.getScreenCTM().inverse());
};

const draw = (
  type: BoundingBoxType,
  addBox: (b: BoundingBox, node: any) => void
) => {
  const svg = SVG(IMAGE_CONTAINER);

  let component: any;

  if (type === 'rect') component = svg.rect({ class: 'box-inner' });
  else component = svg.circle(10, { class: 'box-inner' });

  component.node.setAttribute('fill', 'none');
  component.node.setAttribute('stroke', 'var(--color-warning)');
  component.node.setAttribute('fill', 'var(--color-warning)');
  component.node.setAttribute('fill-opacity', 0.2);
  component.node.setAttribute('stroke-width', 4);

  svg.on('mousedown', (event: any) => {
    if (event.button !== 0) return;
    component.draw(event);
  });

  svg.on('mouseup', (event: any) => {
    if (event.button !== 0) return;
    component.draw(event);
  });

  component.on('drawstop', (event: any) => {
    const { target } = event;

    const uid = uuidv4();
    let box: BoundingBox;
    if (type === 'rect') {
      box = {
        width: target.width.baseVal.value,
        height: target.height.baseVal.value,
        left: target.x.baseVal.value,
        top: target.y.baseVal.value,
        uid: uid,
        type: type,
      };
    } else {
      box = {
        radius: target.r.baseVal.value,
        left: target.cx.baseVal.value,
        top: target.cy.baseVal.value,
        uid: uid,
        type: type,
      };
    }

    component.draw('stop', event);
    addBox(box, component.node);
  });
};

const DesignUtils = { draw, resize, drag, zoom };

export default DesignUtils;
