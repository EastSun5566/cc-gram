/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useState, useEffect, useRef } from 'react';

import './Preview.scss';

import { cg } from '../../cg';

const Preview: React.FC<{
  imageURL: string;
  setImageURL: React.Dispatch<React.SetStateAction<string>>;
}> = ({ imageURL, setImageURL }) => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const image = useRef<HTMLImageElement>(null);

  useEffect(() => {
    cg.applyFilter('#preview-image');
  }, [selectedFilter]);

  const download = async () => {
    const { current } = image;
    if (!current) throw new Error('No Image');

    const a = document.createElement('a');
    a.href = await cg.getDataURL(current);
    a.download = selectedFilter;
    a.click();
  };

  return (
    <div className="preview">

      <div className="image-container">
        <img
          id="preview-image"
          src={imageURL}
          data-filter={selectedFilter}
          alt={selectedFilter.toUpperCase()}
          ref={image}
        />
        <button
          type="button"
          className="btn btn-light btn-cross"
          onClick={() => setImageURL('')}
        >
          <i className="fa fa-times" />
        </button>
        <button
          type="button"
          className="btn btn-light btn-download"
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
