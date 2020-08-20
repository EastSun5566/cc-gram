import React from 'react';

import './UploadInput.scss';

interface UploadInputProps {
  onUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const UploadInput: React.FC<UploadInputProps> = ({ onUpload }) => (
  <div className="input-container">
    <i className="fas fa-cloud-upload-alt" />
    <input
      type="file"
      accept="image/*"
      onChange={onUpload}
    />
  </div>
);

export default UploadInput;
