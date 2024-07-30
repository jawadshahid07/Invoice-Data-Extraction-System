import React from 'react';

const UploadedFilesList = ({ files }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-2">Uploaded Files:</h3>
      <ul className="list-disc list-inside text-left">
        {files.map((file, index) => (
          <li key={index} className="mb-1">{file}</li>
        ))}
      </ul>
    </div>
  );
};

export default UploadedFilesList;
