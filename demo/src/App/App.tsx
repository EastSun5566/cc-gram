import React, { FC, useState, useEffect } from 'react';
import CCGram from 'cc-gram';

import './App.scss';

import GithubCorner from '../components/GithubCorner/GithubCorner';

const cg = new CCGram();

const App: FC = () => {
  const [imageURL, setImageURL] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');

  useEffect(() => {
    cg.applyFilter();
  }, [imageURL, selectedFilter]);

  const uploadImage = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    if (!target.files) return;

    const image = target.files[0];
    setImageURL(URL.createObjectURL(image));
  };

  const UploadInput: FC = () => (
    <div className="input-container">
      <i className="fas fa-cloud-upload-alt" />

      <input
        type="file"
        accept="image/*"
        onChange={uploadImage}
      />
    </div>
  );

  const Preview: FC = () => (
    <div className="preview">

      <div className="image-container">
        <img
          src={imageURL}
          data-filter={selectedFilter}
          alt=""
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
                alt=""
              />

              <figcaption>{filterName}</figcaption>
            </figure>
          ))
        }
      </div>

    </div>
  );

  return (
    <>
      <div id="app">
        {imageURL
          ? <Preview />
          : <UploadInput /> }
      </div>

      <GithubCorner />
    </>
  );
};

export default App;
