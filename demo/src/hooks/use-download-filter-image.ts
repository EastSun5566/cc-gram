import { useRef } from 'react';
import { FilterInstance } from 'cc-gram';

interface UseDownloadFilterImageOptions {
  downloadFileName?: string;
  filter: FilterInstance;
}

interface DownloadOptions {
  downloadFileName?: string
}

export const useDownloadFilterImage = ({ filter }: UseDownloadFilterImageOptions): {
  imageRef: React.RefObject<HTMLImageElement>;
  download(downloadOptions: DownloadOptions): Promise<void>;
} => {
  const imageRef = useRef<HTMLImageElement>(null);

  const download = async ({
    downloadFileName = 'download',
  } = {}) => {
    const { current } = imageRef;
    if (!current || !(current instanceof HTMLImageElement)) throw new TypeError('ref must be an image');

    const a = document.createElement('a');
    a.href = await filter.getDataURL(current, { type: 'image/jpeg' }) || '';
    a.download = downloadFileName;
    a.click();
  };

  return { imageRef, download };
};

export default useDownloadFilterImage;
