// resources/js/Pages/Roles/Index.jsx
import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import DataTable from '@/Components/table/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/ui/form/Button';
import { IoAddOutline } from 'react-icons/io5';
import { onConfirm } from '@/lib/appAlert';
import { Inertia } from '@inertiajs/inertia';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import RoundedButton from '@/Components/ui/RoundedButton';
import RoundedButtonLink from '@/Components/ui/RoundedButtonLink';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/Hooks/usePermission';

const Index = ({ columns }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const [refreshDatatable, setRefreshDatatable] = useState(false);
    var tableColumns = columns.map(col => ({
        Header: col.header,
        accessor: col.accessor,
        visible: col.visibility, // optional: used for conditionally showing columns
    }));

    const destroy = id => {
        onConfirm(t('confirm_delete_role'))
            .then(() => {
                router.delete(route('roles.destroy', id));
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
                    {hasPermission('roles edit') && (
                        <RoundedButtonLink
                            href={route('roles.edit', row.original.id)}
                            icon={<FaPencil />}
                            popoverText={t('edit')}
                            buttonType={BUTTON_TYPES.PRIMARY}
                            outline
                        />
                    )}
                    {hasPermission('roles delete') && (
                        <RoundedButton
                            icon={<FaTrash />}
                            popoverText={t('delete')}
                            buttonType={BUTTON_TYPES.DANGER}
                            onClick={() => destroy(row.original.id)}
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
                {/* <Head title={t('roles')} /> */}
                <div className="flex justify-between ">
                    <div></div>
                    <div>
                        <ButtonLink
                            href={route('roles.create')}
                            icon={<IoAddOutline />}
                            buttonType={BUTTON_TYPES.PRIMARY}
                        >
                            {t('add_new')}
                        </ButtonLink>
                    </div>
                </div>
                <div className="rounded-lg bg-white">
                    <DataTable
                        permissionModule="roles"
                        columns={tableColumns}
                        // duplicateUrl={route('roles.create')}
                        pdfUrl={route('roles.pdf')}
                        exportUrl={route('roles.export')}
                        url={route('roles.datatable')}
                        // deleteUrl={route('roles.bulkDelete')}
                        // editUrl={route('roles.bulkEdit')}
                        primaryKey={'id'}
                        refreshDatatable={refreshDatatable}
                        setRefreshDatatable={setRefreshDatatable}
                        hideActions
                    />
                </div>
            </AuthenticatedLayout>
        </>
    );
};

export default Index;
