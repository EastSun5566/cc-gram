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

  const uploadImage = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    if (!target.files) return;

    const image = target.files[0];
    setImageURL(URL.createObjectURL(image));
  };

  return (
    <>
      <div id="app">
        {imageURL
          ? (
            <Preview imageURL={imageURL} />
          )
          : <UploadInput uploadImage={uploadImage} /> }
      </div>

      <GithubCorner />
    </>
  );
};

export default App;
