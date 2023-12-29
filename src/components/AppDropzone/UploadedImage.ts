export interface UploadedImage {
  url: string;
  file: File | null;
  width?: number;
  height?: number;
  zIndex?: number;
}
