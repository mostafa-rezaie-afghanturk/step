import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { FaTimes } from 'react-icons/fa';

/**
 * Helper function to infer file name and type from a given path.
 * This is a best-effort guess based on file extension.
 */
const getFileInfoFromPath = filePath => {
    const fileNameMatch = filePath.match(/[^/\\]+$/); // Gets the last part of the path (filename)
    const name = fileNameMatch ? fileNameMatch[0] : filePath; // Fallback to full path if no filename found

    const extensionMatch = name.match(/\.([^.]+)$/); // Gets the extension
    const extension = extensionMatch ? extensionMatch[1].toLowerCase() : '';

    let type = 'application/octet-stream'; // Default generic binary type

    // Basic MIME type inference based on common extensions
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            type = 'image/jpeg';
            break;
        case 'png':
            type = 'image/png';
            break;
        case 'gif':
            type = 'image/gif';
            break;
        case 'bmp':
            type = 'image/bmp';
            break;
        case 'webp':
            type = 'image/webp';
            break;
        case 'pdf':
            type = 'application/pdf';
            break;
        case 'doc':
        case 'docx':
            type = 'application/msword';
            break;
        case 'xls':
        case 'xlsx':
            type = 'application/vnd.ms-excel';
            break;
        case 'ppt':
        case 'pptx':
            type = 'application/vnd.ms-powerpoint';
            break;
        case 'txt':
            type = 'text/plain';
            break;
        case 'zip':
            type = 'application/zip';
            break;
        // Add more as needed
    }

    return { name, url: filePath, type };
};

/**
 * initialFiles: array of file paths (strings) or objects { name, url, type }
 */
const AppDropZone = ({
    onChange,
    accept,
    multiple = true,
    maxFiles = 10,
    initialFiles = [],
}) => {
    // Internal state to manage files, can be File objects or { name, url, type } objects
    const [files, setFiles] = useState([]);
    const { t } = useTranslation();

    // This state stores the original initial file paths for consistent output
    const [originalInitialPaths, setOriginalInitialPaths] = useState([]);

    // Effect to process initialFiles when component mounts or initialFiles prop changes
    useEffect(() => {
        if (initialFiles && initialFiles.length > 0) {
            setFiles(prevFiles => {
                const existingFileIdentifiers = new Set(
                    prevFiles.map(f =>
                        f instanceof File
                            ? `${f.name}-${f.size}`
                            : `${f.name}-${f.url}`
                    )
                );

                const formattedInitialFiles = initialFiles.map(file => {
                    if (typeof file === 'string') {
                        return {
                            ...getFileInfoFromPath(file),
                            _isInitialPath: true,
                        }; // Mark as initial path
                    }
                    return file; // Already an object (assume from previous render or different source)
                });

                const newInitialFilesToAdd = formattedInitialFiles.filter(
                    initialFile => {
                        const identifier = `${initialFile.name}-${initialFile.url}`;
                        return !existingFileIdentifiers.has(identifier);
                    }
                );

                // Store original paths to reconstruct output later
                setOriginalInitialPaths(
                    initialFiles.filter(f => typeof f === 'string')
                );

                // Merge and slice to maxFiles
                return [...prevFiles, ...newInitialFilesToAdd].slice(
                    0,
                    maxFiles
                );
            });
        } else {
            // If initialFiles becomes empty, clear originalInitialPaths
            setOriginalInitialPaths([]);
            setFiles(prevFiles => prevFiles.filter(f => f instanceof File)); // Keep only actual File objects
        }
    }, [initialFiles, maxFiles]);

    // Helper to format the output for the onChange callback
    const formatOutputFiles = useCallback(
        currentFiles => {
            const output = currentFiles.map(file => {
                if (file instanceof File) {
                    return file; // Return File object as is for new files
                } else if (file._isInitialPath) {
                    return file.url; // Return original path string for initial files
                }
                // Fallback for other potential object types if needed, though _isInitialPath should catch them
                return file;
            });
            return multiple ? output : output[0] || null;
        },
        [multiple]
    );

    const onDrop = useCallback(
        acceptedFiles => {
            setFiles(prevFiles => {
                const updatedFiles = multiple
                    ? [...prevFiles, ...acceptedFiles]
                    : acceptedFiles.slice(0, 1);

                const limitedFiles = updatedFiles.slice(0, maxFiles);
                onChange(formatOutputFiles(limitedFiles)); // Call onChange immediately with formatted output
                return limitedFiles;
            });
        },
        [multiple, maxFiles, onChange, formatOutputFiles]
    );

    const removeFile = useCallback(
        fileToRemove => {
            setFiles(prevFiles => {
                const updatedFiles = prevFiles.filter(f => {
                    if (f instanceof File && fileToRemove instanceof File) {
                        return f !== fileToRemove;
                    }
                    if (
                        !(f instanceof File) &&
                        !(fileToRemove instanceof File)
                    ) {
                        // Compare initial files by name and URL for uniqueness
                        return !(
                            f.name === fileToRemove.name &&
                            f.url === fileToRemove.url
                        );
                    }
                    return true;
                });
                onChange(formatOutputFiles(updatedFiles)); // Call onChange immediately with formatted output
                return updatedFiles;
            });
        },
        [onChange, formatOutputFiles]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept,
        multiple,
    });

    // Clean up object URLs when component unmounts or files change
    useEffect(() => {
        return () => {
            files.forEach(file => {
                if (file instanceof File) {
                    // Only revoke for actual File objects
                    URL.revokeObjectURL(file.preview || file); // Use file.preview if set, else file itself (for File objects)
                }
            });
        };
    }, [files]);

    return (
        <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-black/5">
            <div
                {...getRootProps()}
                className={`p-6 text-center cursor-pointer transition-all duration-300 rounded-xl ${
                    isDragActive ? 'bg-blue-100 border-blue-500' : ''
                }`}
            >
                <input {...getInputProps()} />
                <p className="text-gray-600">
                    {isDragActive
                        ? t('drop_file')
                        : t('drop_or_click')}
                </p>
            </div>

            {files.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
                    {files.map((file, index) => {
                        const isFileObj = file instanceof File;
                        const fileType = isFileObj ? file.type : file.type;
                        const isImage =
                            fileType && fileType.startsWith('image/');
                        const preview = isFileObj
                            ? URL.createObjectURL(file)
                            : file.url;
                        const fileName = file.name || 'Unknown File';
                        const filePath = isFileObj
                            ? file.path || file.name
                            : file.url;

                        return (
                            <div
                                // Use a more robust key that uniquely identifies each file type
                                key={
                                    isFileObj
                                        ? `${file.name}-${file.size}-${file.lastModified}`
                                        : `${file.name}-${file.url}`
                                }
                                className="relative border rounded-lg p-2 bg-white shadow-sm"
                            >
                                {isImage ? (
                                    <a
                                        href={filePath}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={preview}
                                            alt={fileName}
                                            className="h-28 w-full object-cover rounded-md"
                                            onLoad={() => {
                                                if (isFileObj)
                                                    URL.revokeObjectURL(
                                                        preview
                                                    );
                                            }}
                                        />
                                    </a>
                                ) : (
                                    <div className="h-28 flex items-center justify-center text-sm text-gray-500 text-center p-2">
                                        <a
                                            href={filePath}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <span className="break-all">
                                                {fileName}
                                            </span>
                                        </a>
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
            )}
        </div>
    );
};

export default AppDropZone;
