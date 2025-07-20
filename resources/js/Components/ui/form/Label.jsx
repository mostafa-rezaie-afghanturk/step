import { Label as HeadlessLabel } from '@headlessui/react';
import React from 'react';

const Label = ({
    text,
    htmlFor,
    className = 'block mb-1 text-sm font-medium text-gray-900 dark:text-white',
    required = false,
    ...props
}) => {
    return (
        <label htmlFor={htmlFor} className={`${className}`} {...props}>
            {text} {required && <span className="text-red-500 ">*</span>}
        </label>
    );
};

export default Label;
