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
import { usePermission } from '@/hooks/usePermission';
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
        onConfirm(t('confirm_delete_building'))
            .then(() => {
                router.delete(route('buildings.destroy', id));
                setRefreshDatatable(true);
            })
            .catch(e => {});
    };

    tableColumns = [
        ...tableColumns,
        {
            Header: t('Actions'),
            visible: true,
            id: 'actions',
            Cell: ({ row }) => (
                <div className="flex gap-x-2">
                    {hasPermission('buildings edit') && (
                        <RoundedButtonLink
                            href={route(
                                'buildings.edit',
                                row.original.building_id
                            )}
                            icon={<FaPencil />}
                            popoverText={t('Edit')}
                            outline
                        />
                    )}
                    {hasPermission('buildings delete') && (
                        <RoundedButton
                            icon={<FaTrash />}
                            popoverText={t('delete')}
                            buttonType="danger"
                            onClick={() => destroy(row.original.building_id)}
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
                        <h1 className="text-2xl font-bold">{t('buildings')}</h1>
                    </div>
                    <div>
                        {hasPermission('buildings create') && (
                            <ButtonLink
                                href={route('buildings.create')}
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
                        permissionModule="buildings"
                        columns={tableColumns}
                        duplicateUrl={route('buildings.create')}
                        pdfUrl={route('buildings.pdf')}
                        exportUrl={route('buildings.export')}
                        url={route('buildings.datatable')}
                        deleteUrl={route('buildings.bulkDelete')}
                        editUrl={route('buildings.bulkEdit')}
                        primaryKey={'building_id'}
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
