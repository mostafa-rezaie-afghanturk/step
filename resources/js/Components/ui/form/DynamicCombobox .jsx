import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxButton,
} from '@headlessui/react';
import {
    CheckIcon,
    ChevronDownIcon,
    XMarkIcon,
    PencilIcon,
} from '@heroicons/react/20/solid';
import HTTPClient from '@/lib/HTTPClient';
import { usePermission } from '@/hooks/usePermission';

const DynamicCombobox = ({
    url, // Default to "book-type" URL prefix
    multiple = false,
    placeholder = 'Select an option',
    className,
    disabled = false,
    onChange = () => {}, // Callback when the selected value changes
    defaultValue = '', // Default value for the combobox
    dependsOn = null, // Dependent values for dynamic fetching
    permissionModule, // Module name for permission checks
}) => {
    const { hasPermission } = usePermission(); // Hook for permission checks
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState(null);
    const [options, setOptions] = useState([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [creating, setCreating] = useState(false); // Track creation process
    const [editingOptionId, setEditingOptionId] = useState(null); // Track edit mode
    const [hasFetched, setHasFetched] = useState(false); // Track if options have been fetched
    const [lastDependsOn, setLastDependsOn] = useState(dependsOn); // Track last dependency values
    const apiUrl = `${process.env.REACT_APP_API_URL || ''}/admin/${url}`;

    // Reset options and selected value when `dependsOn` changes
    useEffect(() => {
        if (JSON.stringify(dependsOn) !== JSON.stringify(lastDependsOn)) {
            setHasFetched(false);
            setLastDependsOn(dependsOn);
            setSelected(null);
            setOptions([]);
        }
    }, [dependsOn, lastDependsOn]);



    // Fetch options dynamically based on query and dependencies
    useEffect(() => {
        const fetchOptions = async () => {
            if (!apiUrl) return;
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
                const response = await HTTPClient.get(apiUrl, {
                    params: { ...queryParams, search: query },
                });
                if (Array.isArray(response.data)) {
                    setOptions(response.data);
                    setFilteredOptions(response.data);
                    // Handle default value selection
                    if (defaultValue && !selected) {
                        const defaultOption = response.data.find(
                            option => option.id == defaultValue
                        );
                        if (defaultOption) {
                            setSelected(defaultOption);
                            onChange(defaultOption);
                        }
                    }
                } else {
                    console.error('Invalid data format received from server');
                    setOptions([]);
                    setFilteredOptions([]);
                }
            } catch (error) {
                console.error('Error fetching options:', error);
                setOptions([]);
                setFilteredOptions([]);
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
        apiUrl,
        dependsOn,
        query,
        defaultValue,
        selected,
        onChange,
        hasFetched,
    ]);

    // Clear fetched status when query is empty
    useEffect(() => {
        if (query === '') {
            setHasFetched(false);
        }
    }, [query]);

    const handleCreateOption = async () => {
        if (!query.trim() || !hasPermission(`${permissionModule} create`))
            return; // Check create permission
        setCreating(true);
        try {
            const response = await HTTPClient.post(apiUrl, { name: query });
            setOptions(prevOptions => [...prevOptions, response]);
            setFilteredOptions(prevOptions => [...prevOptions, response]);
            setSelected(response);
            onChange(response); // Trigger onChange callback
            setQuery('');
        } catch (error) {
            console.error('Error creating option', error);
        } finally {
            setCreating(false);
        }
    };

    const handleUpdateOption = async () => {
        if (
            !query.trim() ||
            !editingOptionId ||
            !hasPermission(`${permissionModule} edit`)
        )
            return; // Check edit permission
        try {
            const response = await HTTPClient.put(
                `${apiUrl}/${editingOptionId}`,
                { name: query }
            );
            setOptions(prevOptions =>
                prevOptions.map(option =>
                    option.id === editingOptionId ? response : option
                )
            );
            setFilteredOptions(prevOptions =>
                prevOptions.map(option =>
                    option.id === editingOptionId ? response : option
                )
            );
            setSelected(response);
            onChange(response); // Trigger onChange callback
            setQuery('');
            setEditingOptionId(null); // Exit edit mode
        } catch (error) {
            console.error('Error updating option', error);
        }
    };

    const handleDeleteOption = async optionId => {
        if (!hasPermission(`${permissionModule} delete`)) return; // Check delete permission
        try {
            await HTTPClient.delete(`${apiUrl}/${optionId}`);
            setOptions(prevOptions =>
                prevOptions.filter(option => option.id !== optionId)
            );
            setSelected(null);
            onChange(null); // Trigger onChange callback
            setFilteredOptions(prevOptions =>
                prevOptions.filter(option => option.id !== optionId)
            );
        } catch (error) {
            console.error('Error deleting option', error);
        }
    };

    const handleEditOption = optionId => {
        if (!hasPermission(`${permissionModule} edit`)) return; // Check edit permission
        const optionToEdit = options.find(option => option.id === optionId);
        setQuery(optionToEdit.name);
        setEditingOptionId(optionId);
    };

    const handleChange = selectedOption => {
        setSelected(selectedOption);
        onChange(selectedOption); // Trigger onChange callback
    };

    const handleClear = () => {
        setSelected(null);
        setQuery('');
        onChange(null); // Trigger onChange callback
        setEditingOptionId(null); // Exit edit mode
    };

    const isQueryExisting = filteredOptions.some(
        option => option.name.toLowerCase() === query.toLowerCase()
    );

    return (
        <Combobox value={selected} onChange={handleChange} multiple={multiple}>
            <div className="relative">
                <ComboboxInput
                    className={clsx(
                        className ??
                            'w-full rounded-lg border border-gray-300 bg-black/5 py-1.5 pe-10 ps-3 text-sm/6 text-black',
                        'focus:outline-none focus:ring-2 focus:ring-black/25',
                        { 'opacity-50 cursor-not-allowed': disabled }
                    )}
                    displayValue={item => item?.name}
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
                            key={option.id}
                            value={option}
                            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-200"
                        >
                            <div className="flex justify-between w-full items-center">
                                <div className="flex items-center">
                                    <CheckIcon className="invisible size-4 fill-black group-data-[selected]:visible" />
                                    <div className="text-sm/6 text-black">
                                        {option.name}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {hasPermission(
                                        `${permissionModule} delete`
                                    ) && (
                                        <button
                                            className="ml-2 text-red-500"
                                            onClick={() =>
                                                handleDeleteOption(option.id)
                                            }
                                        >
                                            <XMarkIcon className="w-4 h-4 text-red-500 hover:text-red-600" />
                                        </button>
                                    )}
                                    {hasPermission(
                                        `${permissionModule} edit`
                                    ) && (
                                        <button
                                            className="ml-2 text-blue-500"
                                            onClick={() =>
                                                handleEditOption(option.id)
                                            }
                                        >
                                            <PencilIcon className="w-4 h-4 text-blue-500 hover:text-blue-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </ComboboxOption>
                    ))
                )}
                {!isQueryExisting &&
                    query &&
                    !editingOptionId &&
                    hasPermission(`${permissionModule} create`) && (
                        <div className="py-2 px-3 text-sm text-gray-700">
                            <button
                                onClick={handleCreateOption}
                                className="w-full text-left bg-green-100 py-1 px-2 rounded-lg"
                                disabled={creating}
                            >
                                {creating ? 'Creating...' : 'Create new option'}
                            </button>
                        </div>
                    )}
                {editingOptionId &&
                    hasPermission(`${permissionModule} edit`) && (
                        <div className="py-2 px-3 text-sm text-gray-700">
                            <button
                                onClick={handleUpdateOption}
                                className="w-full text-left bg-yellow-100 py-1 px-2 rounded-lg"
                            >
                                Update Option
                            </button>
                        </div>
                    )}
            </ComboboxOptions>
        </Combobox>
    );
};
export default DynamicCombobox;
