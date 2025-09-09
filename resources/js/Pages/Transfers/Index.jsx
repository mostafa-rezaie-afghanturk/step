// resources/js/Pages/asset-transfer/Index.jsx
import React, { useState } from 'react';
import DataTable from '@/Components/table/datatable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { IoAddOutline } from 'react-icons/io5';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import { FaPencil, FaTrash, FaEye } from 'react-icons/fa6';
import { IoArrowUndo } from 'react-icons/io5';
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
    onConfirm(t('confirm_delete', { name: t('transfer') }))
      .then(() => {
        router.delete(route('asset-transfer.delete', id));
        setRefreshDatatable(true);
      })
      .catch(e => { });
  };

  const markAsReturned = id => {
    onConfirm(t('confirm_return', { name: t('asset') }))
      .then(() => {
        router.post(route('asset-transfer.return', id), {}, {
          onSuccess: () => {
            setRefreshDatatable(true);
          }
        });
      })
      .catch(e => { });
  };

  tableColumns = [
    ...tableColumns,
    {
      Header: t('Actions'),
      visible: true,
      id: 'actions',
      Cell: ({ row }) => (
        <div className="flex gap-x-2">
          {hasPermission('asset-transfer read') && (
            <RoundedButtonLink
              href={route('asset-transfer.show', row.original.transfer_transaction_id)}
              icon={<FaEye />}
              popoverText={t('view')}
              buttonType={BUTTON_TYPES.INFO}
              outline
            />
          )}
          {hasPermission('asset-transfer edit') && row.original.return_status === 'Transferred' && (
            <RoundedButtonLink
              href={route('asset-transfer.edit', row.original.transfer_transaction_id)}
              icon={<FaPencil />}
              popoverText={t('edit')}
              buttonType={BUTTON_TYPES.PRIMARY}
              outline
            />
          )}
          {hasPermission('asset-transfer edit') && row.original.return_status === 'Transferred' && (
            <RoundedButton
              icon={<IoArrowUndo />}
              popoverText={t('mark_returned')}
              buttonType={BUTTON_TYPES.SUCCESS}
              onClick={() => markAsReturned(row.original.transfer_transaction_id)}
              outline
            />
          )}
          {hasPermission('asset-transfer delete') && (
            <RoundedButton
              icon={<FaTrash />}
              popoverText={t('delete')}
              buttonType={BUTTON_TYPES.DANGER}
              onClick={() => destroy(row.original.transfer_transaction_id)}
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
            <h1 className="text-2xl font-bold">{t('asset-transfer')}</h1>
          </div>
          <div>
            {hasPermission('asset-transfer create') && (
              <ButtonLink
                href={route('asset-transfer.create')}
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
            permissionModule="asset-transfer"
            columns={tableColumns}
            duplicateUrl={route('asset-transfer.create')}
            pdfUrl={route('asset-transfer.pdf')}
            exportUrl={route('asset-transfer.export')}
            url={route('asset-transfer.datatable')}
            deleteUrl={route('asset-transfer.bulkDelete')}
            editUrl={route('asset-transfer.bulkEdit')}
            primaryKey={'transfer_transaction_id'}
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
