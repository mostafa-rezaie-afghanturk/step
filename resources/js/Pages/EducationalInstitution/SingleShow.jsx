import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import LogActivity from '@/Components/Logs/LogActivity';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/Hooks/usePermission';
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
            if (!hasPermission('educational-institutions read')) {
                setOpen(false);
            }
            fetch(route('educational-institutions.show', { id: selectedId }))
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
                        name={singleData?.name_en}
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
                                        itemName={t('Institution Code')}
                                        itemText={singleData?.institution_code}
                                    />
                                    <SingleRow
                                        itemName={t('Institution ID')}
                                        itemText={singleData?.institution_id}
                                        itemName2={t('Name')}
                                        itemText2={singleData?.name_en}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Turkish Name')}
                                        itemText={singleData?.name_tr}
                                        itemName2={t('Local Name')}
                                        itemText2={singleData?.name_local}
                                    />
                                    <SingleRow
                                        itemName={t('Type')}
                                        itemText={singleData?.type}
                                        itemName2={t('Stage')}
                                        itemText2={singleData?.stage}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Campus')}
                                        itemText={singleData?.campus?.name_en}
                                        itemName2={t('Start Date')}
                                        itemText2={singleData?.start_date}
                                    />
                                    <SingleRow
                                        itemName={t('Status')}
                                        itemText={singleData?.status}
                                        itemName2={t('Open Date')}
                                        itemText2={singleData?.open_date}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Former Name')}
                                        itemText={singleData?.former_name}
                                        itemName2={t('Level')}
                                        itemText2={singleData?.level}
                                    />
                                </div>
                            )}
                            {activeTab == 'logs' && (
                                <LogActivity
                                    url={'educational-institutions.logActivity'}
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
