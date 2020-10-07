/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React from 'react';

import './Preview.scss';

import { cg } from '../../cg';
import { useFilters, useDownloadImage } from '../../hooks';

interface PreviewProps {
  imageURL?: string;
  onClear?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export const Preview: React.FC<PreviewProps> = ({
  imageURL,
  onClear,
}) => {
  const [selectedFilter, setSelectedFilter] = useFilters({
    selectors: '#preview-image',
  });
  const { imageRef, download } = useDownloadImage({ downloadFileName: selectedFilter });

  if(!imageURL) return null;

  return (
    <div className="preview">
      <div className="image-container">
        <img
          id="preview-image"
          src={imageURL}
          data-filter={selectedFilter}
          alt={selectedFilter.toUpperCase()}
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
          onClick={download}
        >
          <i className="fas fa-cloud-download-alt" />
        </button>
      </div>

      <div className="filters-container">
        {
          cg.filterNames.map((filterName) => (
            <figure
              role="button"
              className={selectedFilter === filterName ? 'selected' : ''}
              key={filterName}
              onClick={() => setSelectedFilter(filterName)}
              onKeyPress={() => setSelectedFilter(filterName)}
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
