# React Image Utils

A React implementation featuring image upload, drag-and-drop, resizing, zooming, sending to the background, and saving a collage of several images and texts to a single image file.

## Installation

```bash
# Clone the repository
git clone https://github.com/luizveronesi/react-image-utils.git

# Navigate to the project directory
cd react-image-utils

# Install dependencies
npm install
```

```bash
# Docker installation
docker build . -t react-image-utils:latest
docker create --name react-image-utils --network your-network --ip x.x.x.x --restart unless-stopped roboto-node:latest
docker start react-image-utils
```

## Usage

```bash
# Run the application
npm start
```

### Design Mode

In this mode, it is possible to upload one image and draw rectangles and circles over that image. By clicking on the respective symbol on the toolbox (displayed after the image upload), the user may draw over the image. By double clicking, an alert is displayed with its position data. Scrolling wheel zooms in and out. Dragging the image is possible by holding mouse left button.

### Collage Mode

Collage mode allows multiple image uploading, with dragging and resizing. Text may be added with specific font size, font family and color. By double clicking an image, it is sent to background. It possible to choose a color to the background using a color picker. The final collage may be downloaded as a single image.

## Demo

https://luizveronesi.s3.amazonaws.com/react-image-utils/index.html

## Next steps

Implement unit tests.

Unify SVG libraries used in design mode.
