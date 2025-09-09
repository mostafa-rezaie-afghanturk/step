import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import LogActivity from '@/Components/Logs/LogActivity';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { usePermission } from '@/Hooks/usePermission';

const SingleShow = ({ open, setOpen, selectedId }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [singleData, setSingleData] = useState([]);
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        {
            id: 'all',
            label: t('All'),
        },
    ];

    useEffect(() => {
        setActiveTab('all');
        setSingleData([]);
        setIsLoading(true);
        if (open) {
            if (!hasPermission('activity-log read')) {
                setOpen(false);
            }
            fetch(route('activityLog.show', { id: selectedId }))
                .then(response => response.json())
                .then(data => {
                    setSingleData(data?.records[0]);
                })
                .catch(error => console.error(error))
                .finally(() => setIsLoading(false));
        }
        setIsLoading(false);
    }, [open]);

    return (
        <Modal>
            <ModalBody
                className="md:!max-w-[70%]"
                status={open}
                onClose={() => setOpen(false)}
            >
                {!isLoading && (
                    <SingleViewHeader
                        name={t('Activity Log Details')}
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
                                        itemName={t('event')}
                                        itemText={singleData?.event}
                                        itemName2={t('Description')}
                                        itemText2={singleData?.description}
                                        
                                    />
                                    <SingleRow
                                        itemName={t('causer_type')}
                                        itemText={singleData?.causer_type}
                                        itemName2={t('causer_id')}
                                        itemText2={singleData?.causer_id}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('causer')}
                                        itemText={singleData?.causer?.name}
                                        
                                    />
                                    <SingleRow
                                        itemName={t('subject_type')}
                                        itemText={singleData?.subject_type}
                                        itemName2={t('subject_id')}
                                        itemText2={singleData?.subject_id}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('properties')}
                                        itemText={
                                            <pre>
                                                {JSON.stringify(
                                                    singleData?.properties,
                                                    null,
                                                    2
                                                )}
                                            </pre>
                                        }
                                        singleRow
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </ModalContent>
            </ModalBody>
        </Modal>
    );
};

export default SingleShow;
