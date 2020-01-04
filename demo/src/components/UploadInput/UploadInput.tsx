import React from 'react';

const UploadInput: React.FC<{
  uploadImage: ((event: React.ChangeEvent<HTMLInputElement>) => void);
}> = ({ uploadImage }) => (
  <div className="input-container">
    <i className="fas fa-cloud-upload-alt" />

    <input
      type="file"
      accept="image/*"
      onChange={uploadImage}
    />
  </div>
);

export default UploadInput;
