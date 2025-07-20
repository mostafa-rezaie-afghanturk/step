import React from 'react';
import clsx from 'clsx';

const Checkbox = ({ checked, onChange, className, ...props }) => {
    const defaultClasses = clsx(
        'w-4 h-4',
        'text-brand bg-gray-100 border-gray-300 rounded',
        'focus:ring-brand focus:ring-2',
        'dark:focus:ring-brand dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed'
    );

    return (
        <input
            type="checkbox"
            checked={checked}
            onChange={onChange}
            className={clsx(defaultClasses, className)}
            {...props}
        />
    );
};

export default Checkbox;
