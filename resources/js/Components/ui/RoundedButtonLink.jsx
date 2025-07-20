import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Link } from '@inertiajs/react';
import {
    BUTTON_TYPES,
    COMMON_BUTTON_STYLES,
} from '@/Components/Constants/buttons';

const RoundedButtonLink = ({
    href,
    icon,
    popoverText,
    buttonType = BUTTON_TYPES.PRIMARY,
    iconSize = 'text-xs',
    className,
    outline = false,
    ...props
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showPopover, setShowPopover] = useState(false);
    const timeoutRef = useRef(null);

    const buttonClasses = clsx(
        COMMON_BUTTON_STYLES.rounded,
        COMMON_BUTTON_STYLES.variants[buttonType],
        COMMON_BUTTON_STYLES.variants[buttonType][
            outline ? 'outline' : 'solid'
        ],
        className
    );

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => {
                setIsHovered(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(() => {
                    setShowPopover(true);
                }, 300);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setShowPopover(false);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            }}
        >
            <Link href={href} className={buttonClasses} {...props}>
                <span className={iconSize}>{icon}</span>
            </Link>

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

RoundedButtonLink.propTypes = {
    href: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    popoverText: PropTypes.string,
    buttonType: PropTypes.oneOf(Object.values(BUTTON_TYPES)),
    iconSize: PropTypes.string,
    className: PropTypes.string,
    outline: PropTypes.bool,
};

export default RoundedButtonLink;
