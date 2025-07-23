import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import LogActivity from '@/Components/Logs/LogActivity';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';

const SingleShow = ({ open, setOpen, selectedId }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [singleData, setSingleData] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        {
            id: 'all',
            label: t('Information'),
        },
        {
            id: 'logs',
            label: t('ActivityLogs'),
        },
    ];

    useEffect(() => {
        setActiveTab('all');
        setSingleData([]);
        setIsLoading(true);
        if (open) {
            if (!hasPermission('lands read')) {
                setOpen(false);
            }
            fetch(route('lands.show', { id: selectedId }))
                .then(response => response.json()) // one extra step
                .then(data => {
                    setSingleData(data?.record);
                })
                .catch(error => console.error(error))
                .finally(() => setIsLoading(false));
        }
        setIsLoading(false);
    }, [open]);

    return (
        <Modal>
            <ModalBody
                className="md:!max-w-[70%] "
                status={open}
                onClose={() => setOpen(false)}
            >
                {!isLoading && (
                    <SingleViewHeader
                        name={singleData?.land_code}
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
                                            className={`inline-flex items-center justify-center px-4 py-2 border-b-2 hover:cursor-pointer ${
                                                activeTab === tab.id
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
                            {activeTab == 'all' && (
                                <div>
                                    <SingleRow
                                        itemName={t('Land Code')}
                                        itemText={singleData?.land_code}
                                    />
                                    <SingleRow
                                        itemName={t('Address')}
                                        itemText={singleData?.address}
                                        itemName2={t('Province')}
                                        itemText2={singleData?.province}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('District')}
                                        itemText={singleData?.district}
                                        itemName2={t('Neighborhood')}
                                        itemText2={singleData?.neighborhood}
                                    />
                                    <SingleRow
                                        itemName={t('Street')}
                                        itemText={singleData?.street}
                                        itemName2={t('Door Number')}
                                        itemText2={singleData?.door_number}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Country Land Number')}
                                        itemText={
                                            singleData?.country_land_number
                                        }
                                        itemName2={t('Size SqM')}
                                        itemText2={singleData?.size_sqm}
                                    />
                                    <SingleRow
                                        itemName={t('TMV Start Date')}
                                        itemText={singleData?.tmv_start_date}
                                        itemName2={t('Ownership Status')}
                                        itemText2={singleData?.ownership_status}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Purchase Price')}
                                        itemText={singleData?.purchase_price}
                                        itemName2={t('Purchase Date')}
                                        itemText2={singleData?.purchase_date}
                                    />
                                    <SingleRow
                                        itemName={t('Rental Fee')}
                                        itemText={singleData?.rental_fee}
                                        itemName2={t('Lease Start')}
                                        itemText2={singleData?.lease_start}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Lease End')}
                                        itemText={singleData?.lease_end}
                                        itemName2={t('Country')}
                                        itemText2={singleData?.country?.name}
                                    />
                                </div>
                            )}
                            {activeTab == 'logs' && (
                                <LogActivity
                                    url={'lands.logActivity'}
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
