import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import LogActivity from '@/Components/Logs/LogActivity';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import FileList from '@/Components/ui/FileList';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/20/solid';

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
                                            singleData?.has_clean_water ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                        itemName2={t('Dirty Water')}
                                        itemText2={
                                            singleData?.has_dirty_water ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Natural Gas')}
                                        itemText={
                                            singleData?.has_natural_gas ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                        itemName2={t('Has Fire Escape')}
                                        itemText2={
                                            singleData?.has_fire_escape ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                    />
                                    <SingleRow
                                        itemName={t('Has Elevator')}
                                        itemText={
                                            singleData?.has_elevator ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                        itemName2={t('Has Fire Escape')}
                                        itemText2={
                                            singleData?.has_fire_escape ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                    />
                                    <SingleRow
                                        itemName={t('Door Details')}
                                        itemText={
                                            <div>
                                                {singleData?.has_door ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                                ) : (
                                                    <XCircleIcon className="h-5 w-5 text-red-400" />
                                                )}
                                                {Boolean(
                                                    singleData?.has_door
                                                ) && (
                                                    <div>
                                                        <ul className="space-y-2 mt-2">
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Door Material'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.door_material
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Door Wingspan (cm)'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.door_wingspan_cm
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Observation Window Type'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.observation_window_type
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Has Door Threshold'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.has_door_threshold
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Has Door Shin Guard'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.has_door_shin_guard
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Has Door Centre Back'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.has_door_centre_back
                                                                }
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        itemName2={t('Window Details')}
                                        itemText2={
                                            <div>
                                                {singleData?.has_window ? (
                                                    <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                                ) : (
                                                    <XCircleIcon className="h-5 w-5 text-red-400" />
                                                )}
                                                {Boolean(
                                                    singleData?.has_window
                                                ) && (
                                                    <div>
                                                        <ul className="space-y-2 mt-2">
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Window Total Area'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.window_total_area
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Window Starting Height'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.window_starting_height
                                                                }
                                                            </li>
                                                            <li>
                                                                <strong>
                                                                    {t(
                                                                        'Window Opening Type'
                                                                    )}
                                                                </strong>
                                                                :{' '}
                                                                {
                                                                    singleData?.window_opening_type
                                                                }
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        }
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Data Outputs')}
                                        itemText={
                                            <ul className="space-y-2">
                                                {Object.entries(
                                                    (() => {
                                                        try {
                                                            return JSON.parse(
                                                                singleData?.data_outputs ||
                                                                    '{}'
                                                            );
                                                        } catch {
                                                            return {};
                                                        }
                                                    })()
                                                ).map(([key, value]) => (
                                                    <li key={key}>
                                                        <strong>
                                                            {t(key)}
                                                        </strong>
                                                        : {value}
                                                    </li>
                                                ))}
                                            </ul>
                                        }
                                        itemName2={t('Notes')}
                                        itemText2={singleData?.notes}
                                    />
                                    <SingleRow
                                        itemName={t('Floor Code')}
                                        itemText={singleData?.floor?.floor_code}
                                        itemName2={t('Building')}
                                        itemText2={
                                            singleData?.floor?.building?.name
                                        }
                                        bgColor
                                    />
                                    <SingleRow
                                        singleRow={true}
                                        itemName={t('Photos')}
                                        itemText={
                                            <div>
                                                <FileList
                                                    files={
                                                        singleData?.room_photos ||
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
