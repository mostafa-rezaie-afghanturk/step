import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/hooks/usePermission';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import RoundedButton from '@/Components/ui/RoundedButton';
import RoundedButtonLink from '@/Components/ui/RoundedButtonLink';
import { BUTTON_TYPES } from '@/Components/Constants/buttons';
import { IoArrowBack } from 'react-icons/io5';
import { FaPencil, FaUndo, FaTrash } from 'react-icons/fa6';
import { onConfirm } from '@/lib/appAlert';
import { router } from '@inertiajs/react';

const Show = ({ transfer }) => {
    const { t } = useTranslation();
    const { hasPermission } = usePermission();

    const markAsReturned = (id) => {
        onConfirm(t('confirm_return', { name: t('asset') }))
            .then(() => {
                router.post(route('asset-transfer.return', id));
            })
            .catch(e => { });
    };

    const destroy = (id) => {
        onConfirm(t('confirm_delete', { name: t('transfer') }))
            .then(() => {
                router.delete(route('asset-transfer.delete', id));
            })
            .catch(e => { });
    };

    const getAssetDisplayName = () => {
        if (!transfer.asset_or_material) return '-';

        const asset = transfer.asset_or_material;
        const group = asset.group || '';
        const subgroup = asset.subgroup || '';
        return `${group} - ${subgroup} (${asset.asset_code})`;
    };

    const getAssetTypeLabel = () => {
        if (transfer.asset_or_material_type === 'App\\Models\\FixtureFurnishing') {
            return t('fixture_furnishing');
        } else if (transfer.asset_or_material_type === 'App\\Models\\EducationalMaterial') {
            return t('educational_material');
        }
        return '-';
    };

    if (!hasPermission('asset-transfer read')) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p className="text-red-600">{t('access_denied')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={t('transfer_details')} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <ButtonLink
                                        href={route('asset-transfer.index')}
                                        className="flex items-center gap-2"
                                        outline
                                    >
                                        <IoArrowBack />
                                        {t('back')}
                                    </ButtonLink>
                                    <h2 className="text-2xl font-semibold">{t('transfer_details')}</h2>
                                </div>

                                <div className="flex gap-2">
                                    {hasPermission('asset-transfer edit') && transfer.return_status === 'Transferred' && (
                                        <RoundedButtonLink
                                            href={route('asset-transfer.edit', transfer.transfer_transaction_id)}
                                            icon={<FaPencil />}
                                            popoverText={t('edit')}
                                            buttonType={BUTTON_TYPES.PRIMARY}
                                            outline
                                        />
                                    )}
                                    {hasPermission('asset-transfer edit') && transfer.return_status === 'Transferred' && (
                                        <RoundedButton
                                            icon={<FaUndo />}
                                            popoverText={t('mark_returned')}
                                            buttonType={BUTTON_TYPES.SUCCESS}
                                            onClick={() => markAsReturned(transfer.transfer_transaction_id)}
                                            outline
                                        />
                                    )}
                                    {hasPermission('asset-transfer delete') && (
                                        <RoundedButton
                                            icon={<FaTrash />}
                                            popoverText={t('delete')}
                                            buttonType={BUTTON_TYPES.DANGER}
                                            onClick={() => destroy(transfer.transfer_transaction_id)}
                                            outline
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('transfer_information')}</h3>
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('transfer_id')}</dt>
                                                <dd className="text-sm text-gray-900">{transfer.transfer_transaction_id}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('transfer_date')}</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(transfer.transfer_date).toLocaleDateString()}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('return_status')}</dt>
                                                <dd className="text-sm">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${transfer.return_status === 'Transferred'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-green-100 text-green-800'
                                                        }`}>
                                                        {transfer.return_status}
                                                    </span>
                                                </dd>
                                            </div>
                                            {transfer.notes && (
                                                <div>
                                                    <dt className="text-sm font-medium text-gray-500">{t('notes')}</dt>
                                                    <dd className="text-sm text-gray-900">{transfer.notes}</dd>
                                                </div>
                                            )}
                                        </dl>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('asset_material_information')}</h3>
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('asset_type')}</dt>
                                                <dd className="text-sm text-gray-900">{getAssetTypeLabel()}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('asset_code')}</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {transfer.asset_or_material?.asset_code || '-'}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('asset_name')}</dt>
                                                <dd className="text-sm text-gray-900">{getAssetDisplayName()}</dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('user_information')}</h3>
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('from_user')}</dt>
                                                <dd className="text-sm text-gray-900">
                                                    <div>
                                                        <div className="font-medium">{transfer.from_user?.name}</div>
                                                        <div className="text-gray-500">{transfer.from_user?.email}</div>
                                                    </div>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('to_user')}</dt>
                                                <dd className="text-sm text-gray-900">
                                                    <div>
                                                        <div className="font-medium">{transfer.to_user?.name}</div>
                                                        <div className="text-gray-500">{transfer.to_user?.email}</div>
                                                    </div>
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-4">{t('system_information')}</h3>
                                        <dl className="space-y-4">
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('created_at')}</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(transfer.created_at).toLocaleString()}
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-sm font-medium text-gray-500">{t('updated_at')}</dt>
                                                <dd className="text-sm text-gray-900">
                                                    {new Date(transfer.updated_at).toLocaleString()}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Show;
