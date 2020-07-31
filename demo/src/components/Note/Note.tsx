import React from 'react';

const Note: React.FC = () => (
  <small className="d-block text-center my-3">
    Made with
    <span role="img" aria-label="heart"> ❤️ </span>
    By
    <a
      href="https://github.com/EastSun5566"
      className="badge badge-pill badge-dark"
      target="_blank"
      rel="noreferrer"
    >
      EastSun5566
    </a>
  </small>
);

export default Note;
