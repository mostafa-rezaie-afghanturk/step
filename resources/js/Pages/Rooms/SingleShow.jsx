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
            if (!hasPermission('rooms read')) {
                setOpen(false);
            }
            fetch(route('rooms.show', { id: selectedId }))
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
                className="md:!max-w-[70%]"
                status={open}
                onClose={() => setOpen(false)}
            >
                {!isLoading && (
                    <SingleViewHeader
                        name={singleData?.room_code}
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
                                        itemName={t('Room Code')}
                                        itemText={singleData?.room_code}
                                    />
                                    <SingleRow
                                        itemName={t('Room Type')}
                                        itemText={singleData?.room_type}
                                        itemName2={t('Size')}
                                        itemText2={singleData?.size}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Width')}
                                        itemText={singleData?.width}
                                        itemName2={t('Flooring')}
                                        itemText2={singleData?.flooring}
                                    />
                                    <SingleRow
                                        itemName={t('Daylight Direction')}
                                        itemText={
                                            singleData?.daylight_direction
                                        }
                                        itemName2={t('Ventilation')}
                                        itemText2={singleData?.ventilation}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Lighting')}
                                        itemText={singleData?.lighting}
                                        itemName2={t('Sound Insulation')}
                                        itemText2={singleData?.sound_insulation}
                                    />
                                    <SingleRow
                                        itemName={t('Paint Condition')}
                                        itemText={singleData?.paint_condition}
                                        itemName2={t('Heating')}
                                        itemText2={singleData?.heating}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Sockets')}
                                        itemText={singleData?.number_of_sockets}
                                        itemName2={t('Seats')}
                                        itemText2={singleData?.seats}
                                    />
                                    <SingleRow
                                        itemName={t('Clean Water')}
                                        itemText={
                                            singleData?.has_clean_water
                                                ? t('Yes')
                                                : t('No')
                                        }
                                        itemName2={t('Dirty Water')}
                                        itemText2={
                                            singleData?.has_dirty_water
                                                ? t('Yes')
                                                : t('No')
                                        }
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Natural Gas')}
                                        itemText={
                                            singleData?.has_natural_gas
                                                ? t('Yes')
                                                : t('No')
                                        }
                                    />
                                    <SingleRow
                                        itemName={t('Door Details')}
                                        itemText={singleData?.door_details}
                                        itemName2={t('Window Details')}
                                        itemText2={singleData?.window_details}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Data Outputs')}
                                        itemText={
                                            Object.entries(JSON.parse(singleData?.data_outputs || '{}'))
                                                .map(([key, value]) => `${key}: ${value}`)
                                                .join(', ') || t('None')
                                        }
                                        itemName2={t('Notes')}
                                        itemText2={singleData?.notes}
                                    />
                                    <SingleRow
                                        itemName={t('Photo')}
                                        itemText={singleData?.photo}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Floor Code')}
                                        itemText={singleData?.floor?.floor_code}
                                        itemName2={t('Building')}
                                        itemText2={
                                            singleData?.floor?.building?.name
                                        }
                                    />
                                </div>
                            )}
                            {activeTab == 'logs' && (
                                <LogActivity
                                    url={'rooms.logActivity'}
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
