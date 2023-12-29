import Dropzone from 'react-dropzone';
import { UploadedImage } from './UploadedImage';
import './style.scss';

type Props = {
  setUploaded: (r: UploadedImage) => void;
  children?: React.ReactNode;
};

function AppDropzone({ setUploaded, children }: Props) {
  const handleDrop = (files: File[]) => {
    const data = URL.createObjectURL(files[0]);

    const img = new Image();
    img.src = data;
    img.onload = () => {
      setUploaded({
        file: files[0],
        url: data,
        width: img.width,
        height: img.height,
        zIndex: 0,
      });
    };
  };

  return (
    <div className="dropzone-container">
      <Dropzone
        onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
        accept={{
          'image/jpeg': [],
          'image/png': [],
        }}
        maxFiles={1}
      >
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} className="dropzone" title="upload file">
            <input {...getInputProps()} />
            {children ? (
              children
            ) : (
              <span>Drag and drop or click to add an image</span>
            )}
          </div>
        )}
      </Dropzone>
    </div>
  );
}

export default AppDropzone;
