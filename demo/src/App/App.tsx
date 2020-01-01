import React from 'react';
import './App.scss';

import GithubCorner from '../components/GithubCorner/GithubCorner';

const App: React.FC = () => (
  <>
    <div id="app">
      {/* <div className="uploader">
      <i className="fas fa-cloud-upload-alt" />

      <input
        type="file"
        accept="image/*"
      />
    </div>

    <div
      v-else
      key="preview"
      className="preview"
    >

      <div
        className="preview-image-container"
      >
        <img src="" alt="" />
      </div>

      <div className="presets-container">
        <figure>

          <img src="" alt="" />

          <figcaption>test</figcaption>
        </figure>
      </div>

    </div> */}
    </div>

    <GithubCorner />
  </>
);

export default App;
