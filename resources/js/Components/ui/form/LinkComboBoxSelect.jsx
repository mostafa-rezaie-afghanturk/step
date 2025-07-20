import React, { useEffect, useState } from 'react';
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import {
    CheckIcon,
    ChevronDownIcon,
    XMarkIcon,
} from '@heroicons/react/20/solid';
import clsx from 'clsx';
import HTTPClient from '@/lib/HTTPClient';

const LinkComboBoxSelect = ({
    url,
    className = null,
    onChange = val => {},
    defaultValue = '',
    dependsOn = null,
    multiple = false,
    disabled = false,
    placeholder = null,
    ...props
}) => {
    const [selected, setSelected] = useState(multiple ? [] : null);
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [lastDependsOn, setLastDependsOn] = useState(dependsOn);

    useEffect(() => {
        if (JSON.stringify(dependsOn) !== JSON.stringify(lastDependsOn)) {
            setHasFetched(false);
            setLastDependsOn(dependsOn);
            setSelected(multiple ? [] : null);
            setOptions([]);
        }
    }, [dependsOn, lastDependsOn]);

    useEffect(() => {
        const fetchOptions = async () => {
            if (!url) return;

            setLoading(true);
            try {
                const queryParams = dependsOn
                    ? Object.entries(dependsOn)
                          .filter(
                              ([_, value]) =>
                                  value !== null && value !== undefined
                          )
                          .reduce((acc, [key, value]) => {
                              acc[key] = value;
                              return acc;
                          }, {})
                    : {};

                const data = await HTTPClient.get(
                    `${url}${query ? `/${query}` : ''}`,
                    { params: queryParams }
                );

                if (Array.isArray(data)) {
                    setOptions(data);

                    // Handle default value selection
                    if (
                        (defaultValue || defaultValue?.length) &&
                        ((multiple && (!selected || selected.length === 0)) ||
                            (!multiple && !selected))
                    ) {
                        if (Array.isArray(defaultValue)) {
                            const defaultOptions = data.filter(option => {
                                return defaultValue.includes(option.value);
                            });
                            if (defaultOptions.length > 0) {
                                setSelected(defaultOptions);
                                onChange(defaultOptions);
                            }

                        } else {
                            // If defaultValue is a single value
                            const defaultOption = data.find(
                                option => option.value === defaultValue
                            );
                            if (defaultOption) {
                                setSelected(defaultOption);
                                onChange(defaultOption);
                            }
                        }
                    }
                } else {
                    console.error('Invalid data format received from server');
                    setOptions([]);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        const debouncedFetch = setTimeout(() => {
            if (!hasFetched || query.length > 0) {
                setHasFetched(true);
                fetchOptions();
            }
        }, 300);

        return () => clearTimeout(debouncedFetch);
    }, [url, dependsOn, query, defaultValue, selected, onChange, hasFetched]);

    useEffect(() => {
        if (query === '') {
            setHasFetched(false);
        }
    }, [query]);

    const filteredOptions = options;

    const handleChange = value => {
        setSelected(value);
        onChange(value);
        setQuery('');
    };

    const handleClear = () => {
        setSelected(multiple ? [] : null);
        setQuery('');
        onChange(multiple ? [] : { value: null });
        if (props?.onClear) {
            props.onClear(); // Delegate custom logic to the parent
        }
    };

    return (
        <>
            <Combobox
                value={selected}
                onChange={handleChange}
                multiple={multiple}
            >
                <div className="relative w-full">
                    <ComboboxInput
                        className={clsx(
                            className ??
                                'w-full rounded-lg border border-gray-300 bg-black/5 py-1.5 pe-10 ps-3 text-sm/6 text-black',
                            'focus:outline-none focus:ring-2 focus:ring-black/25',
                            { 'opacity-50 cursor-not-allowed': disabled }
                        )}
                        displayValue={item => item?.label}
                        onChange={event => setQuery(event.target.value)}
                        disabled={disabled}
                        placeholder={placeholder}
                    />
                    {selected && (
                        <button
                            type="button"
                            className="absolute inset-y-0 right-7 flex items-center px-2"
                            onClick={handleClear}
                        >
                            <XMarkIcon className="w-4 h-4 text-gray-500 hover:text-black" />
                        </button>
                    )}
                    <ComboboxButton
                        className="group absolute inset-y-0 right-0 px-2.5"
                        disabled={disabled}
                    >
                        <ChevronDownIcon className="size-4 fill-black/60 group-hover:fill-black" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-[var(--input-width)] rounded-xl border border-black/5 bg-gray-100 p-1 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 z-50'
                    )}
                >
                    {loading ? (
                        <div className="text-sm py-2 px-3 text-gray-500">
                            Loading...
                        </div>
                    ) : filteredOptions.length === 0 ? (
                        <div className="text-sm py-2 px-3 text-gray-500">
                            No results found
                        </div>
                    ) : (
                        filteredOptions.map(option => (
                            <ComboboxOption
                                key={option.value}
                                value={option}
                                className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-200"
                            >
                                <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                                <div className="text-sm/6 text-black">
                                    {option.label}
                                </div>
                            </ComboboxOption>
                        ))
                    )}
                </ComboboxOptions>
            </Combobox>
            {multiple && Array.isArray(selected) && selected.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                    {selected.map(item => (
                        <span
                            key={item.value}
                            className="flex items-center bg-gray-200 text-black rounded px-2 py-1 text-xs mr-1 mb-1"
                        >
                            {item.label}
                            <button
                                type="button"
                                className="ml-1 text-gray-600 hover:text-black focus:outline-none"
                                onClick={e => {
                                    e.stopPropagation();
                                    const newSelected = selected.filter(
                                        sel => sel.value !== item.value
                                    );
                                    setSelected(newSelected);
                                    onChange(newSelected);
                                }}
                            >
                                <XMarkIcon className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </>
    );
};

export default LinkComboBoxSelect;
