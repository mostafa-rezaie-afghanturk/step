import React, { useState } from 'react';
import { Input as AppInput } from '@headlessui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import clsx from 'clsx';

const PasswordInput = ({
    id,
    placeholder = '',
    value,
    onChange,
    className = clsx(
        'w-full rounded-lg border-none bg-black/5 py-1.5 ps-3 pe-8 text-sm/6 text-black',
        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
    ),
    ...props
}) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="relative">
            <AppInput
                id={id}
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={className}
                {...props}
            />
            <button
                type="button"
                onClick={() => setIsPasswordVisible(prev => !prev)}
                className="absolute ltr:right-2 rtl:left-2 top-1/2 transform -translate-y-1/2 text-black/60 hover:text-black focus:outline-none"
            >
                {isPasswordVisible ? (
                    <FaEyeSlash size={16} />
                ) : (
                    <FaEye size={16} />
                )}
            </button>
        </div>
    );
};

export default PasswordInput;
