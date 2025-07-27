import { useState } from 'react';
import moment from 'moment';
import { Modal, ModalBody, ModalContent } from './Modal';
import { MdDownload } from 'react-icons/md';

export default function FileList({ files }) {
    const [modalImage, setModalImage] = useState(null);
    const [modalAlt, setModalAlt] = useState('');
    return (
        <div className="mb-4">
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b text-start w-64 max-w-xs truncate">
                                Name
                            </th>
                            <th className="px-4 py-2 border-b text-start w-32 max-w-xs truncate">
                                Type
                            </th>
                            <th className="px-4 py-2 border-b text-start w-48 max-w-xs truncate">
                                Date & Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => {
                            const isImage =
                                /^(image\/|jpg$|jpeg$|png$|gif$|bmp$|webp$)/i.test(
                                    file.file_type
                                ) ||
                                /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(
                                    file.name
                                );
                            return (
                                <tr
                                    key={file.file_id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2 border-b text-start  max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={file.file_path}
                                                download={file.name}
                                                className="mr-1 p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                                title="Download"
                                                onClick={e =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <MdDownload className="inline-block" />
                                            </a>
                                            <a
                                                href={file.file_path}
                                                className="text-blue-600 hover:underline block overflow-hidden whitespace-nowrap text-ellipsis"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => {
                                                    if (isImage) {
                                                        e.preventDefault();
                                                        setModalImage(
                                                            file.file_path
                                                        );
                                                        setModalAlt(file.name);
                                                    }
                                                }}
                                                style={{ minWidth: 0, flex: 1 }}
                                            >
                                                {isImage && (
                                                    <img
                                                        src={file.file_path}
                                                        alt={file.name}
                                                        className="inline-block mr-2 align-middle max-h-8 max-w-12 rounded border border-gray-200 bg-gray-50 cursor-pointer"
                                                        style={{
                                                            verticalAlign:
                                                                'middle',
                                                        }}
                                                        onClick={e => {
                                                            e.preventDefault();
                                                            setModalImage(
                                                                file.file_path
                                                            );
                                                            setModalAlt(
                                                                file.name
                                                            );
                                                        }}
                                                    />
                                                )}
                                                {file.name}
                                            </a>
                                        </div>
                                    </td>
                                    <td className="px-4 py-2 border-b text-start max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                                        {file.file_type}
                                    </td>
                                    <td className="px-4 py-2 border-b text-start max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                                        {moment(file.created_at).format(
                                            'YYYY MM DD hh:mm A'
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {modalImage && (
                <Modal>
                    <ModalBody
                        status={!!modalImage}
                        onClose={() => setModalImage(null)}
                    >
                        <ModalContent className="flex flex-col items-center justify-center">
                            <img
                                src={modalImage}
                                alt={modalAlt}
                                className="max-h-[70vh] max-w-full rounded border border-gray-200 bg-gray-50"
                                style={{ objectFit: 'contain' }}
                            />
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-gray-700 text-sm break-all">
                                    {modalAlt}
                                </span>
                                <a
                                    href={modalImage}
                                    download={modalAlt}
                                    className="ml-1 p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                    title="Download image"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 20"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12.75 10.5V3.75a.75.75 0 00-1.5 0v6.75m0 0L8.25 8.25m3 2.25l-3 2.25m0 0V3.75a.75.75 0 00-1.5 0v9.75m0 0l3-2.25"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 16.25h12.5"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </ModalContent>
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
}
