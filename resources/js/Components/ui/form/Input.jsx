import { Input as AppInput } from '@headlessui/react';
import React from 'react';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

const Input = ({
    id,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    className = clsx(
        'w-full rounded-lg border border-gray-300 bg-black/5 py-1.5 px-3 text-sm/6 text-black',
        'focus:outline-none data-[focus]:outline-1 data-[focus]:-outline-offset-1 data-[focus]:outline-brand disabled:cursor-not-allowed disabled:opacity-80',
    ),
    ...props
}) => {
    const { t } = useTranslation();

    return (
        <AppInput
            id={id}
            type={type}
            placeholder={t(placeholder)}
            value={value ?? ""}
            onChange={onChange}
            className={`${className}`}
            {...props}
        />
    );
};

export default Input;
