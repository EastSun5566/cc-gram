import { useRef } from 'react';
import { filter } from '../filter';

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
    a.href = await filter.getDataURL(current, { type: 'image/jpeg' }) || '';
    a.download = downloadFileName;
    a.click();
  };

  return { imageRef, download };
};

export default useDownloadImage;
