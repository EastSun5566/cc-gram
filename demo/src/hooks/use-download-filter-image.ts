import { useRef, useState } from 'react';
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
  error: string | null;
} => {
  const imageRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState<string | null>(null);

  const download = async ({
    downloadFileName = 'download',
  } = {}) => {
    setError(null);
    try {
      const { current } = imageRef;
      if (!current || !(current instanceof HTMLImageElement)) throw new TypeError('ref must be an image');

      const dataURL = await filter.getDataURL(current, { type: 'image/jpeg' });
      if (!dataURL) throw new Error('Image export failed');

      const a = document.createElement('a');
      a.href = dataURL;
      a.download = downloadFileName;
      a.click();
    } catch {
      setError('Unable to download image. Please try again.');
    }
  };

  return { imageRef, download, error };
};

export default useDownloadFilterImage;
