import { Inertia } from '@inertiajs/inertia';
import DataTable from '@/Components/table/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IoAddOutline } from 'react-icons/io5';
import RoundedButton from '@/Components/ui/RoundedButton';
import { FaPencil, FaTrash } from 'react-icons/fa6';
import { onConfirm } from '@/lib/appAlert';
import { useState } from 'react';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import RoundedButtonLink from '@/Components/ui/RoundedButtonLink';
import { useTranslation } from 'react-i18next';
import SingleShow from './SingleShow';
import { router } from '@inertiajs/react';
import { usePermission } from '@/hooks/usePermission';

const Index = ({ columns }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();
    const [refreshDatatable, setRefreshDatatable] = useState(false);
    const [openSingleModal, setOpenSingleModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // columns.filter(col => col.show)
    var tableColumns = columns.map(col => ({
        Header: col.accessor,
        accessor: col.accessor,
        visible: col.visibility, // optional: used for conditionally showing columns
    }));

    const destroy = id => {
        onConfirm(t('confirm_delete_country'))
            .then(() => {
                router.delete(route('countries.destroy', id));
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
                    {hasPermission('countries edit') && (
                        <RoundedButtonLink
                            href={route(
                                'countries.edit',
                                row.original.country_id
                            )}
                            icon={<FaPencil />}
                            popoverText={t('edit')}
                            outline
                        />
                    )}
                    {hasPermission('countries delete') && (
                        <RoundedButton
                            icon={<FaTrash />}
                            popoverText={t('delete')}
                            buttonType="danger"
                            onClick={() => destroy(row.original.country_id)}
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
                {/* <Head title="Countries" /> */}
                <div className="flex justify-between ">
                    <div></div>
                    <div id="add_New_countries">
                        {hasPermission('countries create') && (
                            <ButtonLink
                                href={route('countries.create')}
                                icon={<IoAddOutline />}
                                buttonType={BUTTON_TYPES.PRIMARY}
                            >
                                {t('add_new')}
                            </ButtonLink>
                        )}
                    </div>
                </div>
                <div className="rounded-lg bg-white">
                    <DataTable
                        permissionModule="categories"
                        columns={tableColumns}
                        duplicateUrl={route('countries.create')}
                        pdfUrl={route('countries.pdf')}
                        exportUrl={route('countries.export')}
                        url={route('countries.datatable')}
                        deleteUrl={route('countries.bulkDelete')}
                        editUrl={route('countries.bulkEdit')}
                        primaryKey={'country_id'}
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
