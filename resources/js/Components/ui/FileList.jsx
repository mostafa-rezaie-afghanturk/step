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
                <div className="grid grid-cols-4 bg-white border border-gray-200">
                    <div className="col-span-2 px-4 py-2 border-b text-start font-semibold w-64 max-w-xs truncate">
                        Name
                    </div>
                    <div className="px-4 py-2 border-b text-start font-semibold w-32 max-w-xs truncate">
                        Type
                    </div>
                    <div className="px-4 py-2 border-b text-start font-semibold w-48 max-w-xs truncate">
                        Date & Time
                    </div>
                </div>
                {files.map(file => {
                    const isImage =
                        /^(image\/|jpg$|jpeg$|png$|gif$|bmp$|webp$)/i.test(
                            file.file_type
                        ) || /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(file.name);
                    return (
                        <div
                            key={file.file_id}
                            className="grid grid-cols-4 hover:bg-gray-50 border-b"
                        >
                            <div className="col-span-2 px-4 py-2 text-start max-w-xs overflow-hidden whitespace-nowrap text-ellipsis flex items-center gap-2">
                                <a
                                    href={file.file_path}
                                    download={file.name}
                                    className="mr-1 p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                                    title="Download"
                                    onClick={e => e.stopPropagation()}
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
                                            setModalImage(file.file_path);
                                            setModalAlt(file.name);
                                        }
                                    }}
                                    style={{ minWidth: 0, flex: 1 }}
                                    title={file.name}
                                >
                                    {isImage && (
                                        <img
                                            src={file.file_path}
                                            alt={file.name}
                                            className="inline-block mr-2 align-middle max-h-8 max-w-12 rounded border border-gray-200 bg-gray-50 cursor-pointer"
                                            style={{ verticalAlign: 'middle' }}
                                            onClick={e => {
                                                e.preventDefault();
                                                setModalImage(file.file_path);
                                                setModalAlt(file.name);
                                            }}
                                        />
                                    )}
                                    {file.name}
                                </a>
                            </div>
                            <div className="px-4 py-2 text-start max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                                {file.file_type}
                            </div>
                            <div className="px-4 py-2 text-start max-w-xs overflow-hidden whitespace-nowrap text-ellipsis">
                                {moment(file.created_at).format(
                                    'YYYY MM DD hh:mm A'
                                )}
                            </div>
                        </div>
                    );
                })}
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
                                    <MdDownload className="inline-block" />
                                </a>
                            </div>
                        </ModalContent>
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
}
