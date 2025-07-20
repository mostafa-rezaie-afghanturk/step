import React, { useEffect, useState } from 'react';
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import HTTPClient from '@/lib/HTTPClient';
import { useTranslation } from 'react-i18next';

const TranslateLinkComboBoxSelect = ({
    url,
    className = null,
    onChange = val => {},
    defaultValue = '',
    dependsOn = null,
    multiple = false,
    disabled = false,
    placeholder = null,
    translate = false,
    ...props
}) => {
    const { i18n } = useTranslation();
    const currentLanguage = i18n.language;

    const [selected, setSelected] = useState(null);
    const [query, setQuery] = useState('');
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [lastDependsOn, setLastDependsOn] = useState(dependsOn);

    useEffect(() => {
        if (JSON.stringify(dependsOn) !== JSON.stringify(lastDependsOn)) {
            setHasFetched(false);
            setLastDependsOn(dependsOn);
            setSelected(null);
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
                    const translatedOptions = data.map(option => {
                        if (translate && option.localization) {
                            try {
                                const localizations = JSON.parse(
                                    option.localization
                                );
                                const translation = localizations.find(
                                    loc => loc.language_id === currentLanguage
                                );
                                return {
                                    ...option,
                                    label: translation
                                        ? translation.name
                                        : option.label,
                                };
                            } catch (error) {
                                console.error(
                                    'Error parsing localization:',
                                    error
                                );
                                return option;
                            }
                        }
                        return option;
                    });

                    setOptions(translatedOptions);

                    if (defaultValue && !selected) {
                        const defaultOption = translatedOptions.find(
                            option => option.value == defaultValue
                        );
                        if (defaultOption) {
                            setSelected(defaultOption);
                            onChange(defaultOption);
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
    }, [
        url,
        dependsOn,
        query,
        defaultValue,
        selected,
        onChange,
        hasFetched,
        currentLanguage,
        translate,
    ]);

    useEffect(() => {
        if (query === '') {
            setHasFetched(false);
        }
    }, [query]);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const handleChange = value => {
        setSelected(value);
        onChange(value);
        setQuery('');
    };

    return (
        <Combobox value={selected} onChange={handleChange} multiple={multiple}>
            <div className="relative">
                <ComboboxInput
                    className={
                        className ??
                        clsx(
                            'w-full rounded-lg border border-gray-300 bg-black/5 py-1.5 pe-8 ps-3 text-sm/6 text-black',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
                            { 'opacity-50 cursor-not-allowed': disabled }
                        )
                    }
                    displayValue={item => item?.label}
                    onChange={event => setQuery(event.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={disabled}
                    placeholder={placeholder}
                    {...props}
                />
                <ComboboxButton
                    className="group absolute inset-y-0 ltr:right-0 rtl:left-0 px-2.5"
                    disabled={disabled}
                >
                    <ChevronDownIcon className="size-4 fill-black/60 group-data-[hover]:fill-black" />
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
                ) : options.length === 0 ? (
                    <div className="text-sm py-2 px-3 text-gray-500">
                        No results found
                    </div>
                ) : (
                    options.map(option => (
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
    );
};

export default TranslateLinkComboBoxSelect;
