import { Popover } from '@headlessui/react';
import { useState } from 'react';
import { useDatatable } from './datatableContext';
import Button from '../ui/form/Button';
import { BUTTON_SIZES, BUTTON_TYPES } from '../Constants/buttons';
import { FaPlus } from 'react-icons/fa6';
import { useTranslation } from 'react-i18next';
// import { ChevronDownIcon } from '@heroicons/react/20/solid'; // Optional icon from Heroicons

export default function FilterPopover() {
    const { columns, setFilter: setApplyFilter } = useDatatable();
    const { t } = useTranslation();

    const [filters, setFilters] = useState([
        { field: '', condition: '=', value: '' },
    ]);

    const handleAddFilter = () => {
        setFilters([...filters, { field: '', condition: '=', value: '' }]);
    };

    const handleFilterChange = (index, event) => {
        const newFilters = [...filters];
        newFilters[index][event.target.name] = event.target.value;
        setFilters(newFilters);
    };

    const handleRemoveFilter = index => {
        const newFilters = filters.filter((_, i) => i !== index);
        setFilters(newFilters);
    };

    const applyFilters = async () => {
        setApplyFilter(filters);
    };
    const clearFilters = async () => {
        setFilters([{ field: '', condition: '=', value: '' }]);
    };

    return (
        <Popover className="relative">
            <Popover.Button className="flex items-center hover:bg-brand/20 focus:bg-brand/20 font-semibold px-4 py-1 rounded-md outline-brand">
                <svg
                    stroke="currentColor"
                    className="me-2 h-5 w-5"
                    fill="currentColor"
                    strokeWidth={0}
                    viewBox="0 0 512 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M16 120h480v48H16zm80 112h320v48H96zm96 112h128v48H192z" />
                </svg>
                <span>{t('filter')}</span>
                {/* <ChevronDownIcon className="ml-2 h-5 w-5" /> */}
            </Popover.Button>

            <Popover.Panel className="absolute z-10 mt-2 border w-screen max-w-xs sm:max-w-sm md:max-w-lg ltr:right-0 rtl:left-0 bg-white shadow-lg rounded-lg p-4">
                <div className="space-y-4">
                    {/* Dynamically rendered filter rows */}
                    {filters.map((filter, index) => (
                        <div
                            className="flex flex-wrap items-center space-y-1 md:space-y-0 md:gap-x-2"
                            key={index}
                        >
                            {/* Field Name Select */}
                            <div className="flex flex-wrap items-center md:space-y-0 md:gap-x-1 md:w-11/12">
                                <select
                                    name="field"
                                    value={filter.field}
                                    onChange={event =>
                                        handleFilterChange(index, event)
                                    }
                                    className="form-select w-full md:flex-1 bg-gray-100 border border-gray-300 rounded-md p-1 text-sm"
                                >
                                    <option>{t('field_name')}</option>
                                    {columns.map(
                                        col =>
                                            col.accessor && (
                                                <option
                                                    key={col.accessor}
                                                    value={col.accessor}
                                                >
                                                    {t(col.Header)}
                                                </option>
                                            )
                                    )}
                                </select>
                                {/* Condition Select */}
                                <select
                                    name="condition"
                                    value={filter.condition}
                                    onChange={event =>
                                        handleFilterChange(index, event)
                                    }
                                    className="form-select w-full md:flex-1 bg-gray-100 border border-gray-300 rounded-md p-1 text-sm"
                                >
                                    <option value="=">{t('equals')}</option>
                                    <option value="!=">
                                        {t('not_equals')}
                                    </option>
                                    <option value="like">{t('like')}</option>
                                    <option value="in">{t('in')}</option>
                                    <option value="not in">
                                        {t('not_in')}
                                    </option>
                                </select>
                                {/* Value Input */}
                                <input
                                    name="value"
                                    value={filter.value}
                                    onChange={event =>
                                        handleFilterChange(index, event)
                                    }
                                    type="text"
                                    placeholder={t('value')}
                                    className="w-full  bg-gray-100 border md:flex-1 border-gray-300 rounded-md p-1 text-sm"
                                />
                            </div>
                            {/* Remove Filter Button */}
                            {filters.length > 1 && (
                                <button
                                    className="text-red-500 mt-2 md:mt-0"
                                    onClick={() => handleRemoveFilter(index)}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Action buttons: Clear and Apply */}
                    <div className="filter-action-buttons flex justify-between mt-2">
                        {/* Add Filter Button */}
                        <Button
                            onClick={handleAddFilter}
                            size={BUTTON_SIZES.SMALL}
                            outline
                            icon={<FaPlus className="h-4 w-4" />}
                        >
                            {t('add_a_filter')}
                        </Button>
                        <div className="flex gap-x-1">
                            <Button
                                onClick={clearFilters}
                                size={BUTTON_SIZES.SMALL}
                                buttonType={BUTTON_TYPES.DANGER}
                                outline
                            >
                                {t('clear_filters')}
                            </Button>
                            <Button
                                onClick={applyFilters}
                                size={BUTTON_SIZES.SMALL}
                            >
                                {t('apply_filters')}
                            </Button>
                        </div>
                    </div>
                </div>
            </Popover.Panel>
        </Popover>
    );
}
