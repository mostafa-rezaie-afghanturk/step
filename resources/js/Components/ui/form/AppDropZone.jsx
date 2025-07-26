import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaTimes } from 'react-icons/fa';

const AppDropZone = ({ onChange, accept, multiple = true, maxFiles = 10 }) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback(
        acceptedFiles => {
            const updatedFiles = multiple
                ? [...files, ...acceptedFiles].slice(0, maxFiles)
                : acceptedFiles.slice(0, 1);

            setFiles(updatedFiles);
            onChange(multiple ? updatedFiles : updatedFiles[0] || null);
        },
        [files, multiple, maxFiles, onChange]
    );

    const removeFile = file => {
        const updatedFiles = files.filter(f => f !== file);
        setFiles(updatedFiles);
        onChange(multiple ? updatedFiles : updatedFiles[0] || null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    });

    return (
        <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
            <div
                {...getRootProps()}
                className={`p-6 text-center cursor-pointer transition-all duration-300 rounded-xl ${
                    isDragActive ? 'bg-blue-100 border-blue-500' : ''
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                    {isDragActive
                        ? 'Drop the files here...'
                        : 'Drag & drop files here, or click to select'}
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {files.map((file, index) => {
                    const isImage = file.type.startsWith('image/');
                    const preview = URL.createObjectURL(file);

                    return (
                        <div
                            key={index}
                            className="relative border rounded-lg p-2 bg-white shadow-sm"
                        >
                            {isImage ? (
                                <img
                                    src={preview}
                                    alt={file.name}
                                    className="h-28 w-full object-cover rounded-md"
                                />
                            ) : (
                                <div className="h-28 flex items-center justify-center text-sm text-gray-500 text-center p-2">
                                    {file.name}
                                </div>
                            )}

                            <button
                                type="button"
                                className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
                                onClick={() => removeFile(file)}
                            >
                                <FaTimes className="w-4 h-4 text-red-500" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AppDropZone;
