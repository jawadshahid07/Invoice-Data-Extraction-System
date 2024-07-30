import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import UploadedFilesList from './components/UploadedFilesList';
import ResultDownload from './components/ResultDownload';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');

  const handleUpload = (files) => {
    setUploadedFiles(files);
    // Mock download link for testing
    setDownloadLink('http://localhost:5000/results.xlsx');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="bg-blue-600 text-white w-full py-4 text-center text-2xl font-bold">
        Invoice Data Extraction System
      </header>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <FileUpload onUpload={handleUpload} />
          <UploadedFilesList files={uploadedFiles} />
          <ResultDownload downloadLink={downloadLink} />
        </form>
      </main>
    </div>
  );
}

export default App;
