/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useState, useEffect } from 'react';

import './Preview.scss';

import { cg } from '../../cg';

const Preview: React.FC<{ imageURL: string }> = ({ imageURL }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const download = async (image: HTMLImageElement) => {
    const a = document.createElement('a');
    a.href = await cg.getDataURL(image);
    a.download = selectedFilter;
    a.click();
  };

  useEffect(() => {
    cg.applyFilter('#preview-image');
  }, [selectedFilter]);

  return (
    <div className="preview">

      <div className="image-container">
        <img
          role="button"
          id="preview-image"
          src={imageURL}
          data-filter={selectedFilter}
          alt={selectedFilter.toUpperCase()}
          onClick={({ target }) => download(target as HTMLImageElement)}
          onKeyPress={({ target }) => download(target as HTMLImageElement)}
        />
      </div>

      <div className="filters-container">
        {
          cg.filterNames.map((filterName) => (
            <figure
              role="button"
              className={selectedFilter === filterName ? 'selected' : ''}
              key={filterName}
              onClick={(): void => setSelectedFilter(filterName)}
              onKeyPress={(): void => setSelectedFilter(filterName)}
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
