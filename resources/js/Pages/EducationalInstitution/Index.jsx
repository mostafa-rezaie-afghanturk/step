// resources/js/Pages/Schools/Index.jsx
import React, { useState } from 'react';
import DataTable from '@/Components/table/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IoAddOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import RoundedButtonLink from '@/Components/ui/RoundedButtonLink';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import SingleShow from './SingleShow';
import { usePermission } from '@/Hooks/usePermission';
import RoundedButton from '@/Components/ui/RoundedButton';
import { router } from '@inertiajs/react';
import { onConfirm } from '@/lib/appAlert';

const Index = ({ columns }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();
    const [refreshDatatable, setRefreshDatatable] = useState(false);
    const [openSingleModal, setOpenSingleModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    var tableColumns = columns.map(col => ({
        Header: col.header,
        accessor: col.accessor,
        visible: col.visibility,
    }));

    const destroy = id => {
        onConfirm(t('confirm_delete_institution'))
            .then(() => {
                router.delete(route('educational-institutions.destroy', id));
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
                    {hasPermission('educational-institutions edit') && (
                        <RoundedButtonLink
                            href={route(
                                'educational-institutions.edit',
                                row.original.institution_id
                            )}
                            icon={<FaPencil />}
                            popoverText={t('Edit')}
                            outline
                        />
                    )}
                    {hasPermission('educational-institutions delete') && (
                        <RoundedButton
                            icon={<FaTrash />}
                            popoverText={t('delete')}
                            buttonType="danger"
                            onClick={() => destroy(row.original.institution_id)}
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
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('educational-institutions')}
                        </h1>
                    </div>
                    <div>
                        {hasPermission('educational-institutions create') && (
                            <ButtonLink
                                href={route('educational-institutions.create')}
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
                        permissionModule="educational-institutions"
                        columns={tableColumns}
                        duplicateUrl={route('educational-institutions.create')}
                        pdfUrl={route('educational-institutions.pdf')}
                        exportUrl={route('educational-institutions.export')}
                        url={route('educational-institutions.datatable')}
                        deleteUrl={route('educational-institutions.bulkDelete')}
                        editUrl={route('educational-institutions.bulkEdit')}
                        primaryKey={'institution_id'}
                        refreshDatatable={refreshDatatable}
                        setRefreshDatatable={setRefreshDatatable}
                        setOpenSingleModal={setOpenSingleModal}
                        setSelectedId={setSelectedId}
                    />
                </div>
                <SingleShow
                    open={openSingleModal}
                    setOpen={setOpenSingleModal}
                    selectedId={selectedId}
                />
            </AuthenticatedLayout>
        </>
    );
};

export default Index;
