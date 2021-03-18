import { useRef } from 'react';
import { cg } from '../cg';

interface useDownloadImageOptions {
  downloadFileName?: string;
}

export const useDownloadImage = ({
  downloadFileName = 'download',
}: useDownloadImageOptions = {}): {
  imageRef: React.RefObject<HTMLImageElement>;
  download: () => void;
} => {
  const imageRef = useRef<HTMLImageElement>(null);

  const download = async () => {
    const { current } = imageRef;
    if (!current || !(current instanceof HTMLImageElement)) throw new TypeError('ref must be an image');

    const a = document.createElement('a');
    a.href = await cg.getDataURL(current, {});
    a.download = downloadFileName;
    a.click();
  };

  return { imageRef, download };
};

export default useDownloadImage;
