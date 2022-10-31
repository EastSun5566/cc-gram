/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
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
  if (!imageURL) return null;

  const { filter, selectedFilterName, setSelectedFilterName } = useFilters();
  const { imageRef, download } = useDownloadFilterImage({ filter });

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
        >
          <i className="fa fa-times" />
        </button>
        <button
          type="button"
          className="btn btn-download"
          onClick={() => download({ downloadFileName: selectedFilterName })}
        >
          <i className="fas fa-cloud-download-alt" />
        </button>
      </div>

      <div className="filters-container">
        {
          filter.filterNames.map((filterName) => (
            <figure
              role="button"
              className={selectedFilterName === filterName ? 'selected' : ''}
              key={filterName}
              onClick={() => setSelectedFilterName(filterName)}
              onKeyPress={() => setSelectedFilterName(filterName)}
            >
              <img
                src={imageURL}
                data-filter={filterName}
                alt={filterName.toUpperCase()}
              />
              <figcaption>{filterName.toUpperCase()}</figcaption>
            </figure>
          ))
        }
      </div>
    </div>
  );
};

export default Preview;
