import React from 'react';

const Textarea = ({
    id,
    placeholder = '',
    value,
    onChange,
    className = 'bg-black/5 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3 ',
    ...props
}) => {
    return (
        <textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={`${className}`}
            {...props}
        />
    );
};

export default Textarea;
