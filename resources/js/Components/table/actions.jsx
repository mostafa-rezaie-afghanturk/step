import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useState } from 'react';

import {
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
} from '@/Components/ui/modal';
import { useDatatable } from './datatableContext';
import HTTPClient from '@/lib/HTTPClient';
import ReactLoading from 'react-loading';
import { Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { usePermission } from '@/Hooks/usePermission';

const Actions = ({ permissionModule }) => {
    const [bulkEdit, setBulkEdit] = useState(false);
    const [bulkDelete, setBulkDelete] = useState(false);
    const { t } = useTranslation();
    const { hasPermission } = usePermission();

    const {
        selectedRows,
        columns,
        setVisibleColumns,
        setFilter,
        editUrl,
        Refresh,
        duplicateUrl,
    } = useDatatable();
    return (
        <div>
            {Object.keys(selectedRows).filter(key => selectedRows[key]).length >
                0 && (
                <>
                    <Menu>
                        <MenuButton className="flex items-center hover:bg-brand/20 focus:bg-brand/20 font-semibold px-4 py-1 rounded-md gap-x-2 outline-brand/50">
                            <FaEllipsisVertical className="text-current" />
                            <span>{t('actions')}</span>
                        </MenuButton>

                        <MenuItems
                            transition
                            anchor="bottom end"
                            className="z-10 w-52 origin-top-right rounded-xl border mt-2  bg-white p-1 text-sm/6 text-black transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        >
                            {editUrl &&
                                hasPermission(`${permissionModule} edit`) && (
                                    <MenuItem>
                                        <button
                                            onClick={() => {
                                                setBulkEdit(true);
                                            }}
                                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
                                        >
                                            <svg
                                                stroke="currentColor"
                                                fill="none"
                                                strokeWidth={2}
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                    </MenuItem>
                                )}
                            {Object.keys(selectedRows).filter(
                                key => selectedRows[key]
                            ).length == 1 &&
                                hasPermission(`${permissionModule} create`) && (
                                    <MenuItem>
                                        <Link
                                            href={
                                                duplicateUrl +
                                                Object.keys(
                                                    selectedRows
                                                ).filter(
                                                    key => selectedRows[key]
                                                )[0]
                                            }
                                            method="get"
                                            className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
                                        >
                                            <svg
                                                stroke="currentColor"
                                                fill="none"
                                                strokeWidth="1.5"
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                                height="1em"
                                                width="1em"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                                                />
                                            </svg>
                                            Duplicate
                                        </Link>
                                    </MenuItem>
                                )}
                            {hasPermission(`${permissionModule} delete`) && (
                                <MenuItem>
                                    <button
                                        onClick={() => {
                                            setBulkDelete(true);
                                        }}
                                        className=" group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-black/10"
                                    >
                                        <svg
                                            stroke="currentColor"
                                            fill="none"
                                            strokeWidth="1.5"
                                            viewBox="0 0 24 24"
                                            aria-hidden="true"
                                            height="1em"
                                            width="1em"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                            />
                                        </svg>{' '}
                                        Delete
                                    </button>
                                </MenuItem>
                            )}
                        </MenuItems>
                    </Menu>
                </>
            )}
            <BulkEditModal status={bulkEdit} setStatus={setBulkEdit} />
            <BulkDeleteModal status={bulkDelete} setStatus={setBulkDelete} />
        </div>
    );
};

export default Actions;

const BulkDeleteModal = ({ status, setStatus }) => {
    const {
        setSelectedRows,
        selectedRows,
        columns,
        setVisibleColumns,
        setFilter,
        editUrl,
        Refresh,
        setShowPopup,
        deleteUrl,
    } = useDatatable();
    const [loading, setLoading] = useState(false); // Loading state
    const handleDelete = async () => {
        setLoading(true);
        const idsToDelete = Object.keys(selectedRows).filter(
            key => selectedRows[key]
        );
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');
        try {
            // Make your delete request here, replace the URL with your API endpoint
            const response = await HTTPClient.delete(
                deleteUrl,
                { data: { ids: idsToDelete } },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken, // Include CSRF token
                    },
                }
            );
            // Handle success response
            setShowPopup({
                visible: true,
                type: 'success',
                message: 'Records deleted successfully!',
            });

            // Refresh the data and close the modal if necessary
            Refresh();
            setStatus(false);
            setSelectedRows([]);
        } catch (error) {
            console.error(error);
            setShowPopup({
                visible: true,
                type: 'error',
                message: error.message || 'An error occurred during the update',
            });
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };
    return (
        <Modal>
            {/* <ModalTrigger status={status}>
                Trigger for opening the modal
            </ModalTrigger> */}
            <ModalBody
                status={status}
                setStatus={setStatus}
                title="Bulk Delete"
            >
                <ModalContent>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Are you sure you want to delete the selected
                            records?
                        </label>
                        <p className="text-sm text-red-600">
                            This action cannot be undone.
                        </p>
                    </div>
                </ModalContent>
                <ModalFooter className="gap-4">
                    <button
                        onClick={() => setStatus(false)}
                        className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading ? 'disabled' : ''}
                        className="bg-red-600 text-white text-center flex justify-center dark:bg-red-700 dark:text-white text-sm px-2 py-1 rounded-md border border-red-700 w-28"
                    >
                        {loading ? (
                            <ReactLoading
                                color={'#fff'}
                                type="bars"
                                height={'30%'}
                                width={'30%'}
                            />
                        ) : (
                            `Delete ${Object.keys(selectedRows).filter(key => selectedRows[key]).length} records`
                        )}
                    </button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    );
};

const BulkEditModal = ({ status, setStatus }) => {
    const {
        setSelectedRows,
        selectedRows,
        columns,
        setVisibleColumns,
        setFilter,
        editUrl,
        Refresh,
        setShowPopup,
    } = useDatatable();
    const [loading, setLoading] = useState(false); // Loading state

    const [formValue, setFormValue] = useState({});
    const handleUpdate = async () => {
        const ids = Object.keys(selectedRows).filter(key => selectedRows[key]);
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            .getAttribute('content');

        setLoading(true); // Set loading to true when the request starts

        try {
            // Using HTTPClient.put for the bulk edit
            const response = await HTTPClient.put(
                editUrl,
                {
                    ids: ids,
                    field: formValue.field,
                    value: formValue.value,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken, // Include CSRF token
                    },
                }
            );

            // Handle success response
            setShowPopup({
                visible: true,
                type: 'success',
                message: 'Records update was successful!',
            });

            // Refresh the data and close the modal if necessary
            Refresh();
            setStatus(false);
            setSelectedRows([]);
        } catch (error) {
            // Handle error response
            console.error(error);
            setShowPopup({
                visible: true,
                type: 'error',
                message: error.message || 'An error occurred during the update',
            });
        } finally {
            setLoading(false); // Set loading to false when the request completes
        }
    };

    return (
        <Modal>
            {/* <ModalTrigger status={status}>
                <div className="">
                    Edit
                </div>
            </ModalTrigger> */}
            <ModalBody status={status} setStatus={setStatus} title="Bulk Edit">
                <ModalContent>
                    <div className="mb-4">
                        <label
                            htmlFor="field-name"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Select Field Name
                        </label>
                        <select
                            id="field-name"
                            name="field"
                            onChange={e => {
                                setFormValue({
                                    ...formValue,
                                    field: e.target.value,
                                });
                            }}
                            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-500"
                        >
                            <option value="">--Select a field--</option>

                            {columns
                                .filter(
                                    column =>
                                        column.accessor &&
                                        !column.accessor.includes('.')
                                )
                                .map((col, i) => (
                                    <option key={i} value={col?.accessor}>
                                        {col.Header}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="field-value"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Value
                        </label>
                        <input
                            name="value"
                            type="text"
                            onChange={e => {
                                setFormValue({
                                    ...formValue,
                                    value: e.target.value,
                                });
                            }}
                            id="field-value"
                            className="block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-opacity-50 focus:ring-blue-500 p-2"
                            placeholder="Enter value"
                        />
                    </div>
                </ModalContent>
                <ModalFooter className="gap-4">
                    <button
                        onClick={() => setStatus(false)}
                        className="px-2 py-1 bg-gray-200 text-black dark:bg-black dark:border-black dark:text-white border border-gray-300 rounded-md text-sm w-28"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleUpdate}
                        disabled={loading ? 'disabled' : ''}
                        className="bg-black text-white text-center flex justify-center dark:bg-white dark:text-black text-sm px-2 py-1 rounded-md border border-black w-28"
                    >
                        {loading ? (
                            <ReactLoading
                                color={'#fff'}
                                type="bars"
                                height={'30%'}
                                width={'30%'}
                            />
                        ) : (
                            `Update ${Object.keys(selectedRows).filter(key => selectedRows[key]).length} records`
                        )}
                    </button>
                </ModalFooter>
            </ModalBody>
        </Modal>
    );
};
