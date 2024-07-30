import React from 'react';

const ResultDownload = ({ downloadLink }) => {
  return (
    <div className="mt-6">
      {downloadLink && (
        <a 
          href={downloadLink} 
          download="results.xlsx" 
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300">
          Download Results
        </a>
      )}
    </div>
  );
};

export default ResultDownload;
