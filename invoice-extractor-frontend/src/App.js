import React, { useState, useEffect } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import UploadedFilesList from './components/UploadedFilesList';
import ResultDownload from './components/ResultDownload';
import { FaSun, FaMoon, FaGithub, FaLinkedin, FaGlobe, FaFileAlt } from 'react-icons/fa';

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-cream' : 'bg-cream text-gray-900'} flex flex-col`}>
      <header className="bg-gray-800 dark:bg-gray-900 text-white w-full py-4 px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center">
          <span className="text-2xl font-bold mb-2 sm:mb-0 sm:mr-4">Invoice Data Extraction System</span>
          <div className="flex items-center">
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
        </div>
      </header>
      <main className="flex flex-col lg:flex-row items-center justify-center w-full px-4 py-8 lg:py-40">
        <div className="w-full lg:w-1/3 lg:order-2 lg:ml-4">
          <form
            className="bg-white dark:bg-gray-800 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <FileUpload onUpload={handleUpload} />
            <UploadedFilesList files={uploadedFiles} />
            <ResultDownload downloadLink={downloadLink} />
          </form>
        </div>
        <div className="w-full lg:w-1/3 lg:order-1 bg-white dark:bg-gray-800 shadow-md rounded-xl p-12 mt-4 lg:mt-0">
          <div className="flex justify-end space-x-4 mb-4">
            <a href="https://github.com/jawadshahid07" target="_blank" rel="noopener noreferrer">
              <FaGithub className="text-gray-900 dark:text-cream h-6 w-6" />
            </a>
            <a href="https://linkedin.com/in/jawad07" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-gray-900 dark:text-cream h-6 w-6" />
            </a>
            <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer">
              <FaGlobe className="text-gray-900 dark:text-cream h-6 w-6" />
            </a>
            <a href="https://jawadify.xyz" target="_blank" rel="noopener noreferrer">
              <FaFileAlt className="text-gray-900 dark:text-cream h-6 w-6" />
            </a>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">How to Use</h2>
            <p className="mb-4">
              Enter PDFs or Images, and automate your data extraction process. Receive an excel sheet with all the useful data organized from your invoice in one step! Note that this is currently only functional for digital invoices.
            </p>
            <h2 className="text-xl font-bold mb-2">Contributions</h2>
            <p className="mb-2">
              Check out the GitHub repository for this project:
              <a href="https://github.com/yourprojectrepo" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 ml-1">
                GitHub Repo
              </a>
            </p>
            <p>
              Check out my other projects:
              <a href="https://yourportfolio.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 ml-1">
                Portfolio
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
