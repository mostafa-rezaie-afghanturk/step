import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const PopupMessage = ({ type = 'info', message, duration = 3000, onClose }) => {
    const [show, setShow] = useState(true);

    useEffect(() => {
        // Automatically close the pop-up after the specified duration
        const timer = setTimeout(() => {
            setShow(false);
            if (onClose) onClose(); // Callback when pop-up is closed
        }, duration);

        // Clean up the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [duration, onClose]);

    // Type-based icons and colors
    const iconTypes = {
        success: <FiCheckCircle className="text-green-500" size={24} />,
        error: <FiAlertCircle className="text-red-500" size={24} />,
        info: <FiInfo className="text-blue-500" size={24} />,
    };

    const backgroundColors = {
        success: 'bg-green-100 border-green-500',
        error: 'bg-red-100 border-red-500',
        info: 'bg-blue-100 border-blue-500',
    };

    return (
        show && (
            <div
                className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] flex items-center p-4 rounded-md border-l-4 shadow-lg transition-transform  ease-in-out duration-300 ${
                    backgroundColors[type]
                }`}
                style={{ minWidth: '250px' }}
            >
                {/* Icon */}
                <div className="mr-3">{iconTypes[type]}</div>

                {/* Message */}
                <div className="flex-1 text-gray-800">{message}</div>

                {/* Close Button */}
                <button
                    onClick={() => setShow(false)}
                    className="ml-3 text-gray-600 hover:text-gray-800"
                >
                    <FiX size={20} />
                </button>
            </div>
        )
    );
};

export default PopupMessage;
