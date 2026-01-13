import React, {
  useState,
  lazy,
  Suspense,
  useEffect,
} from 'react';
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
  useEffect(() => () => {
    if (imageURL) {
      URL.revokeObjectURL(imageURL);
    }
  }, [imageURL]);

  return (
    <>
      <main id="app">
        <section className="my-3">
          <img src="https://github.com/EastSun5566/cc-gram/blob/main/logo.webp?raw=true" alt="CCgram Logo" style={{ width: '100px', height: '100px' }} />
        </section>

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
      </main>

      <GithubCorner />
    </>
  );
};

export default App;
