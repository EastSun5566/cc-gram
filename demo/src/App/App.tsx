import React, { FC, useState, useEffect } from 'react';

import './App.scss';

import UploadInput from '../components/UploadInput/UploadInput';
import Preview from '../components/Preview/Preview';
import GithubCorner from '../components/GithubCorner/GithubCorner';

import { cg } from '../cg';

const App: FC = () => {
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    cg.applyFilter();
  }, [imageURL]);

  return (
    <>
      <div id="app">
        {imageURL
          ? (
            <Preview
              imageURL={imageURL}
              setImageURL={setImageURL}
            />
          )
          : <UploadInput setImageURL={setImageURL} /> }
      </div>

      <GithubCorner />
    </>
  );
};

export default App;
