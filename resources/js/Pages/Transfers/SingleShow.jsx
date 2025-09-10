import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/Hooks/usePermission';
import LogActivity from '@/Components/Logs/LogActivity';
import { useTranslation } from 'react-i18next';

const SingleShow = ({ open, setOpen, selectedId }) => {
    const { hasPermission } = usePermission();
    const [isLoading, setIsLoading] = useState(false);
    const [singleData, setSingleData] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const { t } = useTranslation();

    const tabs = [
        {
            id: 'all',
            label: t('All'),
        },
        {
            id: 'logs',
            label: t('ActivityLogs'),
        },
    ];

    useEffect(() => {
        setSingleData([]);
        if (!open || !selectedId) return;
        setIsLoading(true);
        if (!hasPermission('asset-transfer read')) {
            setOpen(false);
            setIsLoading(false);
            return;
        }
        fetch(route('asset-transfer.show', { id: selectedId }))
            .then(response => response.json())
            .then(data => {
                setSingleData(data?.record);
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    }, [open, selectedId]);

    const getAssetDisplayName = () => {
        if (!singleData?.asset_or_material) return '-';

        const asset = singleData.asset_or_material;
        const group = asset.group || '';
        const subgroup = asset.subgroup || '';
        return `${group} - ${subgroup} (${asset.asset_code})`;
    };

    const getAssetTypeLabel = () => {
        if (singleData?.asset_or_material_type === 'App\\Models\\FixtureFurnishing') {
            return t('fixture_furnishing');
        } else if (singleData?.asset_or_material_type === 'App\\Models\\EducationalMaterial') {
            return t('educational_material');
        }
        return '-';
    };

    return (
        <Modal>
            <ModalBody
                className="md:!max-w-[70%]"
                status={open}
                onClose={() => setOpen(false)}
            >
                {!isLoading && (
                    <SingleViewHeader
                        code={singleData?.transfer_transaction_id}
                        name={`Transfer ${singleData?.transfer_transaction_id}`}
                        createdAt={singleData?.created_at}
                        updatedAt={singleData?.updated_at}
                        setOpen={setOpen}
                    />
                )}

                <ModalContent className="!mt-2">
                    <div>
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                                {tabs.map(tab => (
                                    <div className="me-2" key={tab.id}>
                                        <div
                                            className={`inline-flex items-center justify-center px-4 py-2 border-b-2 hover:cursor-pointer ${activeTab === tab.id
                                                ? 'text-brand border-brand'
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                                } rounded-t-lg`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            {tab.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-2 min-h-14 !h-[50vh] overflow-auto">
                            {activeTab === 'all' && (
                                <div className="space-y-2">
                                    <SingleRow
                                        itemName={t('Transfer Date')}
                                        itemText={singleData?.transfer_date ? new Date(singleData.transfer_date).toLocaleDateString() : '-'}
                                        itemName2={t('Return Status')}
                                        itemText2={singleData?.return_status}
                                    />
                                    <SingleRow
                                        itemName={t('From User')}
                                        itemText={singleData?.from_user?.name ? `${singleData.from_user.name} (${singleData.from_user.email})` : '-'}
                                        itemName2={t('To User')}
                                        itemText2={singleData?.to_user?.name ? `${singleData.to_user.name} (${singleData.to_user.email})` : '-'}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Asset Type')}
                                        itemText={getAssetTypeLabel()}
                                        itemName2={t('Asset Details')}
                                        itemText2={getAssetDisplayName()}
                                    />
                                    <SingleRow
                                        singleRow
                                        itemName={t('Notes')}
                                        itemText={singleData?.notes || '-'}
                                        bgColor
                                    />
                                </div>
                            )}

                            {activeTab === 'logs' && (
                                <LogActivity
                                    url={'asset-transfer.logActivity'}
                                    id={selectedId}
                                />
                            )}
                        </div>
                    </div>
                </ModalContent>
            </ModalBody>
        </Modal>
    );
};

export default SingleShow;
