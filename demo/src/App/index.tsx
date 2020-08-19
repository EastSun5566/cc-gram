import React from 'react';
import { CSSTransition } from 'react-transition-group';

import './App.scss';

import {
  UploadInput,
  Preview,
  GithubCorner,
  Note,
} from '../components';
import { useFilters } from '../hooks';

const App: React.FC = () => {
  const [imageURL, setImageURL] = useFilters();

  return (
    <>
      <div id="app">
        <h4 className="title my-3">🖼 CCgram</h4>

        <CSSTransition
          in={!!imageURL}
          timeout={200}
          classNames="fade"
        >
          {
          imageURL
            ? (
              <Preview
                imageURL={imageURL}
                onClear={() => setImageURL('')}
              />
            )
            : (
              <UploadInput
                onUpload={
                  ({ target }) => target.files && setImageURL(URL.createObjectURL(target.files[0]))
                }
              />
            )
          }
        </CSSTransition>

        <Note />
      </div>

      <GithubCorner />
    </>
  );
};

export default App;
