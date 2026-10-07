import React from 'react';

import './Preview.scss';

import { useFilters, useDownloadFilterImage } from '../../hooks';

interface PreviewProps {
  imageURL?: string;
  onClear?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Preview: React.FC<PreviewProps> = ({
  imageURL,
  onClear,
}) => {
  const { filter, selectedFilterName, setSelectedFilterName } = useFilters();
  const { imageRef, download } = useDownloadFilterImage({ filter });

  if (!imageURL) return null;

  return (
    <div className="preview">
      <div className="image-container">
        <img
          id="preview-image"
          src={imageURL}
          data-filter={selectedFilterName}
          alt={selectedFilterName.toUpperCase()}
          ref={imageRef}
        />
        <button
          type="button"
          className="btn btn-cross"
          onClick={onClear}
          aria-label="Clear image"
        >
          <i className="fa fa-times" />
        </button>
        <button
          type="button"
          className="btn btn-download"
          onClick={() => download({ downloadFileName: selectedFilterName })}
          aria-label="Download image"
        >
          <i className="fas fa-cloud-download-alt" />
        </button>
      </div>

      <div className="filters-container">
        {
          filter.filterNames.map((filterName: string) => (
            <button
              type="button"
              className={`filter-option${selectedFilterName === filterName ? ' selected' : ''}`}
              aria-pressed={selectedFilterName === filterName}
              key={filterName}
              onClick={() => setSelectedFilterName(filterName)}
            >
              <img
                src={imageURL}
                data-filter={filterName}
                alt=""
              />
              <span>{filterName.toUpperCase()}</span>
            </button>
          ))
        }
      </div>
    </div>
  );
};

export default Preview;
