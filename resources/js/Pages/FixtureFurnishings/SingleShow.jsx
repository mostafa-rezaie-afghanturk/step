import SingleRow from '@/Components/CustomComponents/SingleRow';
import SingleViewHeader from '@/Components/CustomComponents/SingleViewHeader';
import LogActivity from '@/Components/Logs/LogActivity';
import { Modal, ModalBody, ModalContent } from '@/Components/ui/modal';
import { useEffect, useState } from 'react';
import { usePermission } from '@/Hooks/usePermission';
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
            if (!hasPermission('fixture-furnishings read')) {
                setOpen(false);
            }
            fetch(route('fixture-furnishings.show', { id: selectedId }))
                .then(response => response.json())
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
                        name={singleData?.asset_code}
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
                            {activeTab == 'all' && (
                                <div>
                                    <SingleRow
                                        itemName={t('Asset Code')}
                                        itemText={singleData?.asset_code}
                                        itemName2={t('TMV Code')}
                                        itemText2={singleData?.tmv_code}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Group')}
                                        itemText={singleData?.group}
                                        itemName2={t('Subgroup')}
                                        itemText2={singleData?.subgroup}
                                    />
                                    <SingleRow
                                        itemName={t('Status')}
                                        itemText={singleData?.status}
                                        itemName2={t('Usage')}
                                        itemText2={singleData?.usage}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Available Date')}
                                        itemText={singleData?.available_date}
                                        itemName2={t('Supply Method')}
                                        itemText2={singleData?.supply_method}
                                    />
                                    <SingleRow
                                        itemName={t('Supply Info')}
                                        itemText={singleData?.supply_info}
                                        itemName2={t('Price')}
                                        itemText2={singleData?.price}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Barcode')}
                                        itemText={
                                            singleData?.barcode_url ? (
                                                <img
                                                    src={singleData.barcode_url}
                                                    alt={`Barcode ${singleData?.asset_code}`}
                                                    className="h-18"
                                                />
                                            ) : (
                                                '-'
                                            )
                                        }
                                    />
                                    <SingleRow
                                        itemName={t('Manufacturer')}
                                        itemText={singleData?.manufacturer}
                                        itemName2={t('Production Site')}
                                        itemText2={singleData?.production_site}
                                    />
                                    <SingleRow
                                        itemName={t('Production Date')}
                                        itemText={singleData?.production_date}
                                        itemName2={t('Brand')}
                                        itemText2={singleData?.brand}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Model')}
                                        itemText={singleData?.model}
                                        itemName2={t('Related Level')}
                                        itemText2={singleData?.related_level}
                                    />
                                    <SingleRow
                                        itemName={t('Lifespan (Years)')}
                                        itemText={singleData?.lifespan}
                                        itemName2={t('Start Date')}
                                        itemText2={singleData?.start_date}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Warranty Start')}
                                        itemText={singleData?.warranty_start}
                                        itemName2={t('Warranty End')}
                                        itemText2={singleData?.warranty_end}
                                    />
                                    <SingleRow
                                        itemName={t('Calibration Required')}
                                        itemText={
                                            singleData?.calibration_required ? (
                                                <CheckCircleIcon className="h-5 w-5 text-green-400" />
                                            ) : (
                                                <XCircleIcon className="h-5 w-5 text-red-400" />
                                            )
                                        }
                                        itemName2={t('Service Info')}
                                        itemText2={singleData?.service_info}
                                        bgColor
                                    />
                                    <SingleRow
                                        itemName={t('Technical Specifications')}
                                        itemText={
                                            <ul className="space-y-2">
                                                {Object.entries(
                                                    (() => {
                                                        try {
                                                            return JSON.parse(
                                                                singleData?.technical_specifications ||
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
                                        itemName2={t('Calibration History')}
                                        itemText2={
                                            <ul className="space-y-2">
                                                {Object.entries(
                                                    (() => {
                                                        try {
                                                            return JSON.parse(
                                                                singleData?.calibration_history ||
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
                                    />
                                    <SingleRow
                                        itemName={t('Location Type')}
                                        itemText={singleData?.location_type}
                                        itemName2={t('Location ID')}
                                        itemText2={singleData?.location_id}
                                        bgColor
                                    />
                                    <SingleRow
                                        singleRow={true}
                                        itemName={t('Maintenance Notes')}
                                        itemText={singleData?.maintenance_notes}
                                    />
                                    <SingleRow
                                        singleRow={true}
                                        itemName={t('Warranty Certificates')}
                                        itemText={
                                            <div>
                                                <FileList
                                                    files={
                                                        singleData?.warranty_certs ||
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
                                    url={'fixture-furnishings.logActivity'}
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
