import React from 'react';
import DataTable from '@/Components/table/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/hooks/usePermission';

const Index = ({ columns }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    // Transform columns for DataTable
    var tableColumns = columns.map(col => ({
        Header: col.header,
        accessor: col.accessor,
        visible: col.visibility,
    }));

    // const destroy = id => {
    //     onConfirm('Are you sure you want to delete this permission?')
    //         .then(() => {
    //             router.delete(route('permissions.destroy', id));
    //         })
    //         .catch(e => {});
    // };

    // Add actions column
    tableColumns = [
        ...tableColumns,
        {
            Header: t('actions'),
            visible: true,
            id: 'actions',
            Cell: ({ row }) => (
                <div className="flex gap-x-2">
                    {/* {hasPermission('permissions edit') && (
                        <RoundedButtonLink
                            href={route('permissions.edit', row.original.id)}
                            icon={<FaPencil />}
                            popoverText="Edit"
                            buttonType={BUTTON_TYPES.PRIMARY}
                            outline
                        />
                    )}
                    {hasPermission('permissions delete') && (
                        <RoundedButton
                            icon={<FaTrash />}
                            popoverText="Delete"
                            buttonType={BUTTON_TYPES.DANGER}
                            onClick={() => destroy(row.original.id)}
                            outline
                        />
                    )} */}
                </div>
            ),
        },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between">
                <div></div>
                <div>
                    {/* {hasPermission('permissions create') && (
                        <ButtonLink
                            href={route('permissions.create')}
                            icon={<IoAddOutline />}
                            buttonType={BUTTON_TYPES.PRIMARY}
                        >
                            {t('add_new')}
                        </ButtonLink>
                    )} */}
                </div>
            </div>
            <div className="rounded-lg bg-white">
                <DataTable
                    permissionModule="permissions"
                    columns={tableColumns}
                    // duplicateUrl={route('permissions.create')}
                    pdfUrl={route('permissions.pdf')}
                    exportUrl={route('permissions.export')}
                    url={route('permissions.datatable')}
                    // deleteUrl={route('permissions.bulkDelete')}
                    // editUrl={route('permissions.bulkEdit')}
                    primaryKey={'id'}
                    hideActions
                />
            </div>
        </AuthenticatedLayout>
    );
};

export default Index;
