import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import UploadedFilesList from './components/UploadedFilesList';
import ResultDownload from './components/ResultDownload';
import { FaSun, FaMoon } from 'react-icons/fa';

function App() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [downloadLink, setDownloadLink] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePreference = localStorage.getItem('dark-mode');
    if (darkModePreference === 'enabled') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('dark-mode', 'disabled');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('dark-mode', 'enabled');
    }
    setIsDarkMode(!isDarkMode);
  };

  const handleUpload = (files) => {
    setUploadedFiles(files);
    setDownloadLink('http://localhost:5000/results.xlsx');
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-cream' : 'bg-cream text-gray-900'} flex flex-col items-center justify-center`}>
      <header className="bg-gray-800 dark:bg-gray-900 text-white w-full py-4 px-4 relative">
        <div className="flex justify-center">
          <span className="text-2xl font-bold">Invoice Data Extraction System</span>
        </div>
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
          <FaSun className="text-yellow-400 mr-2" />
          <div
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-12 rounded-full transition duration-300 cursor-pointer ${isDarkMode ? 'bg-gray-700' : 'bg-yellow-400'} mx-2`}
          >
            <div
              className={`absolute h-6 w-6 rounded-full bg-white shadow-md transform transition duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}
            ></div>
          </div>
          <FaMoon className="text-gray-300 ml-2" />
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <form
          className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg"
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
