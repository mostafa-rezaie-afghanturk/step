import React, { useState, useRef } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { useDropzone } from 'react-dropzone';
import RoundedButton from '../ui/RoundedButton';
import { BUTTON_TYPES } from '../Constants/buttons';
import { FaTrash } from 'react-icons/fa6';
import dataURLtoFile from '@/lib/blobToFile';
import { usePage } from '@inertiajs/react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '../ui/modal';
import PrimaryButton from '../PrimaryButton';

const AvatarEditorComponent = ({
    setImage,
    preview,
    setPreview,
    showDeleteBtn,
    setDeleteImage,
}) => {
    const [scale, setScale] = useState(1.2); // Zoom scale for cropping
    const editorRef = useRef(null);
    const user = usePage().props.auth.user;
    const [rawImage, setRawImage] = useState(null);
    const [open, setOpen] = useState(false);

    // Handle file drop
    const { getRootProps, getInputProps } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: acceptedFiles => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setRawImage(URL.createObjectURL(file));
                setImage(URL.createObjectURL(file)); // For preview
                setOpen(true);
            }
        },
    });

    const handleCrop = e => {
        e.preventDefault();
        if (editorRef.current) {
            const canvas = editorRef.current.getImageScaledToCanvas();
            const dataUrl = canvas.toDataURL('image/png'); // Get cropped image as Data URL

            const croppedFile = dataURLtoFile(
                dataUrl,
                `${user.name + '_' + user.id}_avatar.png`
            );
            setImage(croppedFile);
            setPreview(URL.createObjectURL(croppedFile));
            setOpen(false);
        }
    };

    return (
        <div>
            {/* Image Chooser */}
            <div className="relative">
                <div
                    className="cursor-pointer p-5 border-2 border-dashed border-[#ccc] rounded-full w-32 h-32 flex items-center justify-center text-center relative"
                    {...getRootProps()}
                >
                    <input {...getInputProps()} />
                    {preview ? (
                        <img
                            src={preview}
                            // alt="Cropped Avatar"
                            className="w-[125px] h-[125px] rounded-full absolute top-0 left-0 z-0"
                        />
                    ) : (
                        <p>Drop an image or click to upload</p>
                    )}
                </div>
                {(rawImage || preview) && showDeleteBtn && (
                    <RoundedButton
                        icon={<FaTrash />}
                        buttonType={BUTTON_TYPES.DANGER}
                        // popoverText="Delete Item"
                        className="absolute left-24 bottom-4"
                        onClick={e => {
                            e.preventDefault();
                            setPreview('/assets/img/profile_user.jpg');
                            setImage(null);
                            setRawImage(null);
                            setDeleteImage(true);
                        }}
                    />
                )}
            </div>

            {/* Cropper */}
            {rawImage && (
                <Modal>
                    <ModalBody
                        onClickOutside={false}
                        className="!max-w-fit"
                        status={open}
                        onClose={e => {
                            // e.preventDefault();
                            setOpen(false);
                            setImage(null);
                            setPreview(user.profile_picture);
                            setRawImage(null);
                        }}
                    >
                        <ModalContent className="!mt-10">
                            <AvatarEditor
                                ref={editorRef}
                                image={rawImage}
                                width={200}
                                height={200}
                                border={50}
                                borderRadius={100} // Makes the crop circular
                                scale={scale}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <label>Zoom: </label>
                                <input
                                    className="w-full"
                                    type="range"
                                    min="1"
                                    max="4"
                                    step="0.1"
                                    value={scale}
                                    onChange={e =>
                                        setScale(parseFloat(e.target.value))
                                    }
                                />
                            </div>
                        </ModalContent>
                        <ModalFooter>
                            <PrimaryButton onClick={handleCrop}>
                                Crop Image
                            </PrimaryButton>
                        </ModalFooter>
                    </ModalBody>
                </Modal>
            )}
        </div>
    );
};

export default AvatarEditorComponent;
