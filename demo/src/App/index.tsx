import React, { useState, lazy, Suspense } from 'react';
import { CSSTransition } from 'react-transition-group';

import {
  UploadInput,
  GithubCorner,
  Note,
} from '../components';

import './App.scss';

const LazyPreview = lazy(() => import('../components/Preview'));

const App: React.FC = () => {
  const [imageURL, setImageURL] = useState('');

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
              <Suspense fallback={<p>loading...</p>}>
                <LazyPreview
                  imageURL={imageURL}
                  onClear={() => setImageURL('')}
                />
              </Suspense>
            )
            : (
              <UploadInput
                onUpload={
                  ({ target }) => target.files && setImageURL(URL.createObjectURL(target.files[0]))
                }
              />
            )}
        </CSSTransition>

        <Note />
      </div>

      <GithubCorner />
    </>
  );
};

export default App;
