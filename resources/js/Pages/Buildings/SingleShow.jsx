import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import LogActivity from '@/Components/Logs/LogActivity';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next';
import FileList from '@/Components/ui/FileList';

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
            if (!hasPermission('buildings read')) {
                setOpen(false);
            }
            fetch(route('buildings.show', { id: selectedId }))
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
                        name={singleData?.name}
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
                                        itemName={t('Building Code')}
                                        itemText={singleData?.building_code}
                                    />
                                    <SingleRow
                                        itemName={t('Name')}
                                        itemText={singleData?.name}
                                        itemName2={t('Land')}
                                        itemText2={singleData?.land?.land_code}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Construction Date')}
                                        itemText={singleData?.construction_date}
                                        itemName2={t('TMV Start Date')}
                                        itemText2={singleData?.tmv_start_date}
                                    />
                                    <SingleRow
                                        itemName={t('Floor Count')}
                                        itemText={singleData?.floor_count}
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
                                    <SingleRow
                                        singleRow={true}
                                        itemName={t('Purchase Documents')}
                                        itemText={
                                            <div>
                                                <FileList
                                                    files={
                                                        singleData?.purchase_docs ||
                                                        []
                                                    }
                                                />
                                            </div>
                                        }
                                    />
                                    <SingleRow
                                        singleRow={true}
                                        itemName={t('Allocation Documents')}
                                        itemText={
                                            <div>
                                                <FileList
                                                    files={
                                                        singleData?.allocation_docs ||
                                                        []
                                                    }
                                                />
                                            </div>
                                        }
                                    />
                                    <SingleRow
                                        singleRow={true}
                                        itemName={t('Lease Documents')}
                                        itemText={
                                            <div>
                                                <FileList
                                                    files={
                                                        singleData?.lease_docs ||
                                                        []
                                                    }
                                                />
                                            </div>
                                        }
                                    />
                                </div>
                            )}
                            {activeTab == 'logs' && (
                                <LogActivity
                                    url={'buildings.logActivity'}
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
