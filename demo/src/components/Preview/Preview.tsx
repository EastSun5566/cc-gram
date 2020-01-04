import React, { useState, useEffect } from 'react';

import { cg } from '../../cg';

const Preview: React.FC<{
  imageURL: string;
}> = ({ imageURL }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    cg.applyFilter('#preview-image');
  }, [selectedFilter]);

  return (
    <div className="preview">

      <div className="image-container">
        <img
          id="preview-image"
          src={imageURL}
          data-filter={selectedFilter}
          alt={selectedFilter.toUpperCase()}
        />
      </div>

      <div className="filters-container">
        {
          cg.filterNames.map((filterName) => (
            <figure
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
              role="button"
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
