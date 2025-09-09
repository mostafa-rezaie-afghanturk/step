// resources/js/Pages/users/Index.jsx
import React, { useState } from 'react';
import { Inertia, Head } from '@inertiajs/inertia';
import { Link, router, usePage } from '@inertiajs/react';

import DataTable from '@/Components/table/datatable';
import { useMemo } from 'react-dom';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/ui/form/Button';
import { IoAddOutline } from 'react-icons/io5';
import RoundedButton from '@/Components/ui/RoundedButton';
import { FaPencil, FaTrash, FaKey } from 'react-icons/fa6';
import { onConfirm } from '@/lib/appAlert';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import RoundedButtonLink from '@/Components/ui/RoundedButtonLink';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/Hooks/usePermission';
import ChangePasswordModal from './ChangePasswordModal';
import SingleShow from './SingleShow';

const Index = ({ columns }) => {
    const { t } = useTranslation();
    const { hasPermission } = usePermission();
    const [openSingleModal, setOpenSingleModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const [refreshDatatable, setRefreshDatatable] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] =
        useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    const openChangePasswordModal = userId => {
        setSelectedUserId(userId);
        setIsChangePasswordModalOpen(true);
    };

    const closeChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
        setSelectedUserId(null);
    };

    // columns.filter(col => col.show)
    var tableColumns = columns.map(col => ({
        Header: col.header,
        accessor: col.accessor,
        visible: col.visibility, // optional: used for conditionally showing columns
    }));

    const destroy = id => {
        onConfirm(t('confirm_delete', { name: t('user') }))
            .then(() => {
                router.delete(route('users.destroy', id));
                setRefreshDatatable(true);
            })
            .catch(e => {});
    };

    tableColumns = [
        ...tableColumns,
        {
            Header: t('actions'),
            visible: true,
            id: 'actions', // Unique id for the actions column
            Cell: ({ row }) => (
                <div className="flex gap-x-2">
                    {hasPermission('users edit') && (
                        <RoundedButtonLink
                            href={route('users.edit', row.original.id)}
                            icon={<FaPencil />}
                            popoverText={t('edit')}
                            buttonType={BUTTON_TYPES.PRIMARY}
                            outline
                        />
                    )}
                    {hasPermission('users delete') && (
                        <RoundedButton
                            icon={<FaTrash />}
                            popoverText={t('delete')}
                            buttonType={BUTTON_TYPES.DANGER}
                            onClick={() => destroy(row.original.id)}
                            outline
                        />
                    )}
                    {hasPermission('users edit') && (
                        <RoundedButton
                            icon={<FaKey />}
                            popoverText={t('change_password')}
                            buttonType={BUTTON_TYPES.WARNING}
                            onClick={() =>
                                openChangePasswordModal(row.original.id)
                            }
                            outline
                        />
                    )}
                </div>
            ),
        },
    ];

    return (
        <>
            <AuthenticatedLayout>
                {/* <Head title="users" /> */}
                <div className="flex justify-between ">
                    <div></div>
                    <div>
                        {hasPermission('users create') && (
                            <ButtonLink
                                href={route('users.create')}
                                buttonType={BUTTON_TYPES.PRIMARY}
                                icon={<IoAddOutline />}
                            >
                                {t('add_new')}
                            </ButtonLink>
                        )}
                    </div>
                </div>
                <div className="rounded-lg bg-white">
                    <DataTable
                        permissionModule="users"
                        columns={tableColumns}
                        duplicateUrl={route('users.create')}
                        pdfUrl={route('users.pdf')}
                        exportUrl={route('users.export')}
                        url={route('users.datatable')}
                        deleteUrl={route('users.bulkDelete')}
                        editUrl={route('users.bulkEdit')}
                        primaryKey={'id'}
                        refreshDatatable={refreshDatatable}
                        setRefreshDatatable={setRefreshDatatable}
                        setOpenSingleModal={setOpenSingleModal}
                        setSelectedId={setSelectedId}
                        importUrl={route('users.import')}
                        importFormatUrl={
                            '/documents/formats/users-list-format.xlsx'
                        }
                    />
                </div>

                <SingleShow
                    open={openSingleModal}
                    setOpen={setOpenSingleModal}
                    selectedId={selectedId}
                />

                {isChangePasswordModalOpen && (
                    <ChangePasswordModal
                        onClose={closeChangePasswordModal}
                        userId={selectedUserId}
                    />
                )}
            </AuthenticatedLayout>
        </>
    );
};

export default Index;
