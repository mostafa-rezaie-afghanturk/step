import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    BUTTON_TYPES,
    COMMON_BUTTON_STYLES,
} from '@/Components/Constants/buttons';

const RoundedButton = ({
    icon,
    popoverText,
    buttonType = BUTTON_TYPES.PRIMARY,
    iconSize = 'text-xs',
    onClick,
    className,
    outline = false,
    disabled = false,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const timeoutRef = useRef(null);

    const buttonClasses = clsx(
        COMMON_BUTTON_STYLES.rounded,
        COMMON_BUTTON_STYLES.variants[buttonType][
            outline ? 'outline' : 'solid'
        ],
        className
    );

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => {
                if (!disabled) {
                    setIsHovered(true);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    timeoutRef.current = setTimeout(() => {
                        setShowPopover(true);
                    }, 300);
                }
            }}
            onMouseLeave={() => {
                if (!disabled) {
                    setIsHovered(false);
                    setShowPopover(false);
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                }
            }}
        >
            <button
                className={buttonClasses}
                onClick={!disabled && onClick}
                disabled={disabled}
                {...props}
            >
                <span className={iconSize}>{icon}</span>
            </button>

            {popoverText && showPopover && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-center z-10">
                    <div className="relative bg-gray-800 text-white text-xs rounded-md px-2 py-1.5 shadow-lg whitespace-nowrap">
                        {popoverText}
                        <div className="absolute left-1/2 bottom-[-4px] transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                    </div>
                </div>
            )}
        </div>
    );
};

RoundedButton.propTypes = {
    icon: PropTypes.node.isRequired,
    popoverText: PropTypes.string,
    buttonType: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    iconSize: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    outline: PropTypes.bool,
};

export default RoundedButton;
