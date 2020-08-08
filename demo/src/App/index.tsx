import React, { FC, useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';

import './App.scss';

import UploadInput from '../components/UploadInput';
import Preview from '../components/Preview';
import GithubCorner from '../components/GithubCorner';
import Note from '../components/Note';

import { cg } from '../cg';

const App: FC = () => {
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    cg.applyFilter();
  }, [imageURL]);

  return (
    <>
      <div id="app">
        <h4 className="title my-3">🖼 CCgram</h4>

        <CSSTransition
          in={!!imageURL}
          timeout={200}
          classNames="fade"
        >
          {imageURL
            ? (
              <Preview
                imageURL={imageURL}
                setImageURL={setImageURL}
              />
            )
            : <UploadInput setImageURL={setImageURL} /> }
        </CSSTransition>

        <Note />
      </div>

      <GithubCorner />
    </>
  );
};

export default App;
