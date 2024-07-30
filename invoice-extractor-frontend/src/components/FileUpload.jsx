import React, { useState } from 'react';
import { UploadIcon, XIcon } from '@heroicons/react/solid';
import { motion, AnimatePresence } from 'framer-motion';

const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

const FileUpload = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setShowModal(true);
      return;
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    const files = Array.from(event.dataTransfer.files);
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setShowModal(true);
      return;
    }

    setSelectedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleUpload = () => {
    onUpload(selectedFiles.map(file => file.name));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const renderFilePreviews = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedFiles.map((file, index) => {
          const fileUrl = URL.createObjectURL(file);
          return (
            <div key={index} className="relative flex items-center">
              {file.type.startsWith('image/') ? (
                <img
                  src={fileUrl}
                  alt={file.name}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : (
                <div className="bg-cream dark:bg-gray-700 p-2 rounded text-center">{file.name}</div>
              )}
              <button
                type="button"
                onClick={() => handleRemoveFile(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                style={{ zIndex: 10 }} // Lower z-index value for the cross button
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div
        className={`relative mb-4 ${dragOver ? 'border-gray-500 bg-cream dark:bg-gray-700' : 'border-gray-300 dark:border-gray-600'} border-2 border-dashed rounded-lg`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center w-full h-32 cursor-pointer"
        >
          <UploadIcon className="h-12 w-12 text-gray-500 dark:text-cream" />
          <span className="mt-2 text-base leading-normal">
            {selectedFiles.length > 0
              ? `${selectedFiles.length} file(s) selected`
              : 'Drag and drop files here, or click to select files'}
          </span>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>
        <div className="p-4">
          {renderFilePreviews()}
        </div>
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ zIndex: 20 }} // Higher z-index value for the modal
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm mx-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                style={{ zIndex: 21 }} // Ensure modal content has a higher z-index
              >
                <h3 className="text-lg font-semibold">Unsupported File Type</h3>
                <p className="mt-2">Only PDF, JPEG, and PNG files are supported. Please select a different file.</p>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        type="button"
        onClick={handleUpload}
      >
        Upload
      </button>
    </>
  );
};

export default FileUpload;
