import React, { useState, useEffect } from 'react';
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
} from '@headlessui/react';

import clsx from 'clsx';
import { IconChevronDown } from '@tabler/icons-react';
import { FaCheck } from 'react-icons/fa6';
import HTTPClient from '@/lib/HTTPClient';

export default function LinkSelect({ url }) {
    const [query, setQuery] = useState('');
    const [firstData, setFirstData] = useState([]);
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState();

    useEffect(async () => {
        try {
            // Using HTTPClient.put for the bulk edit
            const response = await HTTPClient.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-TOKEN': csrfToken, // Include CSRF token
                },
            });
            setFirstData(response);

            if (data != []) {
                setData(response);
            }
        } catch (error) {
            console.error(error);
        }
    }, []);

    const handleSearch = async event => {
        if (event.target.value == '') {
            setData(firstData);
            setQuery(event.target.value);
        }
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');
        try {
            // Using HTTPClient.put for the bulk edit
            const response = await HTTPClient.get(url + event.target.value, {
                headers: {
                    'Content-Type': 'application/json',
                    // 'X-CSRF-TOKEN': csrfToken, // Include CSRF token
                },
            });
            setData(response);
        } catch (error) {
            console.error(error);
        }
        setQuery(event.target.value);
    };
    const filtereddata =
        query === ''
            ? data
            : data.filter(item => {
                  return item.label.toLowerCase().includes(query.toLowerCase());
              });

    return (
        <div className="">
            <Combobox
                value={selected}
                onChange={value => setSelected(value)}
                onClose={() => setQuery('')}
            >
                <div className="relative">
                    <ComboboxButton
                        className={clsx(
                            'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full ',
                            'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25'
                        )}
                    >
                        <ComboboxInput
                            className={clsx(
                                'w-full rounded-md border-none outline-none text-sm focus:outline-none focus:ring-0 p-1 px-2 bg-gray-50'
                            )}
                            displayValue={item =>
                                data.find(t => t.value === item)?.label
                            }
                            onChange={handleSearch}
                        />{' '}
                    </ComboboxButton>
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <IconChevronDown className="size-4 fill-white/60 group-data-[hover]:fill-white" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-[var(--input-width)] rounded-xl bg-gray-50 border border-gray-300  p-1 mt-2 [--anchor-gap:var(--spacing-1)] empty:invisible',
                        'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
                    )}
                >
                    {filtereddata.map(item => (
                        <ComboboxOption
                            key={item.value}
                            value={item.value}
                            className="group cursor-pointer flex  items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-gray-100"
                        >
                            <FaCheck className="invisible size-4 fill-black group-data-[selected]:visible" />
                            <div className="text-sm/6 text-gray-800">
                                {item.label}
                            </div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </div>
    );
}
