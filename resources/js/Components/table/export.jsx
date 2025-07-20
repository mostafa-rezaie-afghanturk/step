import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalTrigger,
} from '@/Components/ui/modal';
import { useDatatable } from './datatableContext';
import { TbFileExport } from 'react-icons/tb';
import FormButton from '../ui/form/Button';
import { Button, Field, Label, Radio, RadioGroup } from '@headlessui/react';
import { FaRegFileExcel, FaRegFilePdf } from 'react-icons/fa6';
import { MdOutlineFileDownload } from 'react-icons/md';
import { useTranslation } from 'react-i18next';

const Export = () => {
    const {
        selectedRows,
        columns,
        visibleColumns,
        setVisibleColumns,
        setFilter,
        editUrl,
        Refresh,
        exportUrl,
        pdfUrl,
    } = useDatatable();
    const handleSelectedExport = () => {
        // Prepare the parameters
        const ids = Object.keys(selectedRows).filter(key => selectedRows[key]);
        const cols = visibleColumns
            .filter(col => col.visible)
            .map(col => col.accessor);

        const idsString = JSON.stringify(ids);
        const colsString = JSON.stringify(cols);

        // Create a query string from the parameters
        const queryString = new URLSearchParams({
            ids: idsString,
            columns: colsString,
        }).toString();
        // Create a query string from the parameters

        // Open a new tab with the URL and query string
        window.open(`${exportUrl}?${queryString}`, '_blank');
    };

    const HandlePDF = () => {
        if (
            !Object.keys(selectedRows).filter(key => selectedRows[key]).length >
            0
        ) {
            // Prepare the parameters
            const cols = visibleColumns
                .filter(col => col.visible)
                .map(col => col.accessor);

            const colsString = JSON.stringify(cols);

            // Create a query string from the parameters
            const queryString = new URLSearchParams({
                columns: colsString,
            }).toString();
            // Create a query string from the parameters

            // Open a new tab with the URL and query string
            window.open(`${pdfUrl}?${queryString}`, '_blank');
        } else {
            // Prepare the parameters
            const cols = visibleColumns
                .filter(col => col.visible)
                .map(col => col.accessor);
            const ids = Object.keys(selectedRows).filter(
                key => selectedRows[key]
            );

            const idsString = JSON.stringify(ids);
            const colsString = JSON.stringify(cols);

            // Create a query string from the parameters
            const queryString = new URLSearchParams({
                ids: idsString,
                columns: colsString,
            }).toString();
            // Create a query string from the parameters

            // Open a new tab with the URL and query string
            window.open(`${pdfUrl}?${queryString}`, '_blank');
        }
    };

    const { t } = useTranslation();
    const plans = ['all_data', 'selected_data'];
    Object.keys(selectedRows).filter(key => selectedRows[key]).length > 0
        ? plans
        : plans.pop();
    const [selected, setSelected] = useState(plans[0]);
    const [selectedType, setSelectedType] = useState('excel');
    const exportData = () => {
        if (selectedType == 'excel') {
            if (selected == 'selected_data') handleSelectedExport();
            else window.open(exportUrl, '_blank');
        } else HandlePDF();
    };

    useEffect(() => {
        setSelected('all_data');
    }, []);

    return (
        <div>
            {/* {exportUrl && (
                    <Menu>
                        <MenuButton className="flex items-center hover:bg-gray-300 focus:bg-gray-300 font-semibold px-4 py-1 rounded-md space-x-2">
                            <span>Export</span>
                            <TbFileExport className="w-4 h-4" />
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="w-52 origin-top-right rounded-xl border mt-2  bg-white p-1 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            <MenuItem>
                                <button
                                    onClick={() => {
                                        window.open(exportUrl, '_blank');
                                    }}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
                                >
                                    All
                                </button>
                            </MenuItem>
                            {Object.keys(selectedRows).filter(
                                key => selectedRows[key]
                            ).length > 0 && (
                                <MenuItem>
                                    <button
                                        onClick={handleSelectedtExport}
                                        className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
                                    >
                                        Only Selected
                                    </button>
                                </MenuItem>
                            )}

                            <MenuItem>
                                <button
                                    onClick={HandlePDF}
                                    className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
                                >
                                    PDF
                                </button>
                            </MenuItem>
                        </MenuItems>
                    </Menu>
                )} */}
            <Modal>
                <ModalTrigger as={'div'}>
                    <Button className="flex items-center hover:bg-brand/20 focus:bg-brand/20 font-semibold px-4 py-1 rounded-md gap-x-2 outline-brand/50">
                        <TbFileExport className="w-4 h-4" />
                        <span>{t('export')}</span>
                    </Button>
                </ModalTrigger>

                <ModalBody className="lg:!max-w-[19%] !h-[350px] ">
                    <ModalContent className="!pb-2">
                        <div className="flex justify-center">
                            <div className="flex flex-col justify-center items-center">
                                <div
                                    onClick={() => setSelectedType('excel')}
                                    className={`transition-all  duration-150 mx-1 h-20 w-20 flex justify-center items-center border-2 ${selectedType == 'excel' ? 'border-brand' : 'border-gray-300'}  p-2 rounded-full hover:cursor-pointer`}
                                >
                                    <FaRegFileExcel size={45} />
                                </div>
                                Excel
                            </div>
                            <div className="flex flex-col justify-center items-center">
                                <div
                                    onClick={() => setSelectedType('pdf')}
                                    className={`transition-all  duration-150 mx-1 h-20 w-20 flex justify-center items-center border-2 ${selectedType == 'pdf' ? 'border-brand' : 'border-gray-300'}  p-2 rounded-full hover:cursor-pointer`}
                                >
                                    <FaRegFilePdf size={45} />
                                </div>
                                PDF
                            </div>
                        </div>
                        <div className="mt-4">
                            <RadioGroup
                                value={selected}
                                onChange={setSelected}
                                aria-label="Server size"
                            >
                                {plans.map(plan => (
                                    <Field
                                        key={plan}
                                        className="flex items-center gap-2 "
                                    >
                                        <Radio
                                            value={plan}
                                            className="group transition-all  duration-150 flex size-5 items-center justify-center rounded-full border border-gray-300 bg-white data-[checked]:bg-brand"
                                        >
                                            <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
                                        </Radio>
                                        <Label className="hover:cursor-pointer">
                                            {t(plan)}
                                        </Label>
                                    </Field>
                                ))}
                            </RadioGroup>
                        </div>
                    </ModalContent>

                    <ModalFooter>
                        <FormButton onClick={exportData}>
                            {t('download')}
                            <MdOutlineFileDownload
                                size={25}
                                className="ms-2"
                            />{' '}
                        </FormButton>
                    </ModalFooter>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default Export;
