// resources/js/Pages/activity-log/Index.jsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import DataTable from '@/Components/table/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IoAddOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import { FaPencil, FaPeopleGroup, FaTrash } from 'react-icons/fa6';
import RoundedButtonLink from '@/Components/ui/RoundedButtonLink';
import RoundedButton from '@/Components/ui/RoundedButton';
import { onConfirm } from '@/lib/appAlert';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import SingleShow from './SingleShow';
import { usePermission } from '@/hooks/usePermission';
import moment from 'moment';

const Index = ({ columns }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();
    const route = window.route;
    const [refreshDatatable, setRefreshDatatable] = useState(false);
    const [openSingleModal, setOpenSingleModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    var tableColumns = columns.map(col => ({
        Header: col.header,
        accessor: col.accessor,
        visible: col.visibility,
    }));

    const destroy = id => {
        onConfirm(t('confirm_delete', { name: t('annoucement') }))
            .then(() => {
                router.delete(route('activity-log.destroy', id));
                setRefreshDatatable(true);
            })
            .catch(e => {});
    };

    // Modify the column with Header 'Cover Image'
    tableColumns = tableColumns.map(col => {
        if (col.accessor === 'created_at') {
            return {
                ...col, // Spread the existing properties
                Cell: ({ row }) => (
                    <div>
                        {/* Custom cell rendering for the Cover Image */}
                        {moment(row.original.created_at).format(
                            'YYYY MM DD hh:mm A'
                        )}
                    </div>
                ),
            };
        }
        return col; // Return other columns unchanged
    });

    return (
        <>
            <AuthenticatedLayout>
                {/* <Head title="activity-log" /> */}
                <div className="rounded-lg bg-white">
                    <DataTable
                        permissionModule="activity-log"
                        columns={tableColumns}
                        url={route('activityLog.datatable')}
                        primaryKey={'id'}
                        setOpenSingleModal={setOpenSingleModal}
                        setSelectedId={setSelectedId}
                        hideActions
                        hideExport
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
