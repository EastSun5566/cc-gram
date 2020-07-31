import React from 'react';

import './UploadInput.scss';

const UploadInput: React.FC<{
  setImageURL: React.Dispatch<React.SetStateAction<string>>;
}> = ({ setImageURL }) => (
  <div className="input-container">
    <i className="fas fa-cloud-upload-alt" />
    <input
      type="file"
      accept="image/*"
      onChange={({ target }) => {
        if (!target.files) return;
        setImageURL(URL.createObjectURL(target.files[0]));
      }}
    />
  </div>
);

export default UploadInput;
