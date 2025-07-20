import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { useState } from 'react';
import { useDatatable } from './datatableContext';
import Checkbox from '@/Components/ui/form/Checkbox';
import { useTranslation } from 'react-i18next';

export default function ColumnVisibilityPopover({}) {
    // Initialize the state for column visibility
    const { columns, setVisibleColumns } = useDatatable();
    const { t } = useTranslation();

    // const initialVisibility = columns.map(col => col);
    const initialVisibility = columns.filter(col => col.visible !== false).map(col => ({ ...col }));
    const [visibility, setVisibility] = useState(initialVisibility);

    const handleToggleColumn = accessor => {
        const newVisibility = visibility.map(col =>
            col.accessor === accessor ? { ...col, visible: !col.visible } : col
        );
        setVisibility(newVisibility);
        setVisibleColumns(
            newVisibility
                .filter(col => col.visible)
                .map(col => {
                    return col;
                })
        );
    };

    return (
        <Popover className="relative">
            <PopoverButton className="flex items-center hover:bg-brand/20 focus:bg-brand/20 font-semibold px-4 py-1 rounded-md outline-brand/50">
                <svg
                    className="me-2 h-5 w-5"
                    stroke="currentColor"
                    fill="none"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M4 6l5.5 0" />
                    <path d="M4 10l5.5 0" />
                    <path d="M4 14l5.5 0" />
                    <path d="M4 18l5.5 0" />
                    <path d="M14.5 6l5.5 0" />
                    <path d="M14.5 10l5.5 0" />
                    <path d="M14.5 14l5.5 0" />
                    <path d="M14.5 18l5.5 0" />
                </svg>
                <span>{t('columns')}</span>
            </PopoverButton>

            <PopoverPanel className="absolute z-10 border mt-2 w-screen max-w-xs sm:max-w-sm md:max-w-lg ltr:right-0 rtl:left-0 bg-white shadow-lg rounded-lg p-4">
                <div className="space-y-4">
                    <h3 className="font-semibold">{t('Select Columns')}</h3>
                    <div className="grid md:grid-cols-2 gap-2">
                        {visibility.map((col, index) => (
                            <div
                                key={col.accessor || index}
                                className="flex items-center"
                            >
                                <Checkbox
                                    checked={col.visible}
                                    onChange={() =>
                                        handleToggleColumn(col.accessor)
                                    }
                                    id={col.accessor}
                                    className="me-2"
                                />
                                <label
                                    htmlFor={col.accessor}
                                    className="text-sm"
                                >
                                    {t(
                                        columns.find(
                                            c => c.accessor === col.accessor
                                        ).Header
                                    )}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </PopoverPanel>
        </Popover>
    );
}
