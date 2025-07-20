import React, { useEffect } from 'react';

const Select = ({ id, children, value, onChange, className, ...props }) => {
    useEffect(() => {
        if (value === undefined || value === null) {
            const childrenArray = React.Children.toArray(children);
            if (childrenArray.length > 0) {
                const firstOption = childrenArray.find(
                    child => child.props && child.props.value !== undefined
                );
                if (firstOption && onChange) {
                    onChange({ target: { value: firstOption.props.value } });
                }
            }
        }
    }, [value, children]);

    return (
        <select
            id={id}
            value={value ?? ''}
            onChange={onChange}
            className={`${className} bg-black/5 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full py-2 px-3`}
            {...props}
        >
            {children}
        </select>
    );
};

export default Select;
