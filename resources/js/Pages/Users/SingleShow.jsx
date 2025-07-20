import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
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
        setIsLoading(true);
        if (open) {
            if (!hasPermission('users read')) {
                setOpen(false);
            }
            fetch(route('users.show', selectedId))
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
                        code={
                            singleData?.profile_picture ? (
                                <img
                                    src={
                                        `/storage/` +
                                        singleData?.profile_picture
                                    }
                                    className="h-full w-full object-cover"
                                    alt={t('User')}
                                />
                            ) : (
                                <img
                                    src={'/assets/img/no-cover-image.jpeg'}
                                    alt={singleData?.name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            )
                        }
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
                                        itemName={t('name')}
                                        itemText={singleData?.name}
                                        itemName2={t('email')}
                                        itemText2={singleData?.email}
                                    />
                                    <SingleRow
                                        itemName={t('username')}
                                        itemText={singleData?.username}
                                        itemName2={t('Country')}
                                        itemText2={singleData?.country?.name}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('School')}
                                        itemText={singleData?.school?.name}
                                        itemName2={t('Library')}
                                        itemText2={singleData?.library?.library_name}
                                    />
                                    <SingleRow
                                        itemName={t('role')}
                                        itemText={singleData?.roles && singleData?.roles[0]?.name}
                                        itemName2={t('account_type')}
                                        itemText2={singleData?.account_type}
                                        bgColor
                                    />
                                </div>
                            )}

                            {activeTab == 'logs' && (
                                <LogActivity
                                    url={'users.logActivity'}
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
