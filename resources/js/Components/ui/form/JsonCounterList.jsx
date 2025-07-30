import React, { useState, useEffect } from 'react';
import Label from './Label';
import { useTranslation } from 'react-i18next';
import Input from './Input';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import RoundedButton from '../RoundedButton';

export default function JsonCounterList({ col, data, setData }) {
    const { t } = useTranslation();
    // Merge col.option and col.default (object or array) to get all unique options
    const getDefaultKeys = () => {
        if (Array.isArray(col.default)) return col.default;
        if (col.default && typeof col.default === 'object')
            return Object.keys(col.default);
        return [];
    };
    const getAllOptions = () => {
        const base = Array.isArray(col.option) ? col.option : [];
        const defaults = getDefaultKeys();
        return Array.from(new Set([...base, ...defaults]));
    };
    const [options, setOptions] = useState(getAllOptions());
    const [newOption, setNewOption] = useState('');
    const [deletedOptions, setDeletedOptions] = useState([]);

    // Sync options with col.default and col.option if they change
    useEffect(() => {
        setOptions(getAllOptions());
    }, [col.option, col.default]);

    const handleAddOption = () => {
        const trimmed = newOption.trim();
        if (trimmed && !options.includes(trimmed)) {
            const updatedOptions = [...options, trimmed];
            setOptions(updatedOptions);
            setData(col.name, {
                ...data[col.name],
                [trimmed]: 0,
            });
            setNewOption('');
        }
    };

    const handleDeleteOption = option => {
        // Add to deletedOptions so it is filtered out from mergedOptions
        setDeletedOptions(prev => [...prev, option]);
        const updatedOptions = options.filter(o => o !== option);
        setOptions(updatedOptions);
        const { [option]: _, ...rest } = data[col.name] || {};
        setData(col.name, rest);
    };

    // Merge options and col.default (object or array) for rendering, to ensure all are shown, but filter out deletedOptions
    const mergedOptions = Array.from(
        new Set([...options, ...getDefaultKeys()])
    ).filter(option => !deletedOptions.includes(option));

    return (
        <div className="flex flex-col flex-wrap gap-2">
            {mergedOptions.map(option => (
                <div key={option} className="flex items-center gap-2">
                    <Label className="w-48 text-sm" text={t(option)} />
                    <Input
                        id={col.name}
                        placeholder={col.placeholder || ''}
                        onChange={e =>
                            setData(col.name, {
                                ...data[col.name],
                                [option]: parseInt(e.target.value || 0),
                            })
                        }
                        type="number"
                        min="0"
                        value={data[col.name]?.[option] || 0}
                    />
                    <RoundedButton
                        icon={<FaMinus />}
                        popoverText={t('remove')}
                        buttonType="primary"
                        onClick={() => handleDeleteOption(option)}
                        outline
                        type="button"
                    />
                </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
                <Input
                    type="text"
                    placeholder={t('Add new option')}
                    value={newOption}
                    onChange={e => setNewOption(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleAddOption();
                    }}
                />
                <RoundedButton
                    icon={<FaPlus />}
                    popoverText={t('add')}
                    buttonType="primary"
                    onClick={handleAddOption}
                    outline
                    type="button"
                />
            </div>
        </div>
    );
}
