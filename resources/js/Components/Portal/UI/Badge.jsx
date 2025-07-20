import React from 'react';
import PropTypes from 'prop-types';
import 'tailwindcss/tailwind.css'; // Make sure Tailwind CSS is properly imported

const Badge = ({ text, onClick, className }) => {
    const badgeClasses = `inline-block h-fit whitespace-nowrap rounded-full px-3 py-1 text-xs text-indigo-500 bg-indigo-50 mb-1 ${className}`;

    return (
        <span
            className={badgeClasses}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {text}
        </span>
    );
};

Badge.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    className: PropTypes.string,
};

export default Badge;
