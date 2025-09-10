import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import DataTable from '../table/datatable';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const LogActivity = ({ id, url, subTable = null, subUrl = '' }) => {
    const { t } = useTranslation();
    const tableColumns = [
        { Header: 'id', accessor: 'id', visible: true },
        { Header: 'causer_name', accessor: 'causer.name', visible: true },
        { Header: 'causer_email', accessor: 'causer.email', visible: true },
        { Header: 'action', accessor: 'event', visible: true },
        {
            Header: 'changes',
            accessor: 'properties',
            visible: true,
            Cell: ({ row }) => (
                <div key={row.original.id} className="md:!min-w-[400px]">
                    <Disclosure>
                        <DisclosureButton className="group flex items-center gap-2 text-brand hover:cursor-pointer hover:underline">
                            {t('changes')}
                            <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel>
                            <div className="flex">
                                <div>
                                    <p className="m-0 font-semibold">
                                        {t('Attrs')}
                                    </p>
                                    {row?.original?.properties?.attributes &&
                                        Object.entries(
                                            row?.original?.properties
                                                ?.attributes
                                        ).map(([key, value]) => {
                                            return (
                                                <div>{`${key}: ${value}`}</div>
                                            );
                                        })}
                                </div>
                                {row?.original?.properties?.old && (
                                    <div className="ms-5">
                                        <p className="m-0 font-semibold">Old</p>
                                        {Object.entries(
                                            row?.original?.properties?.old
                                        ).map(([key, value]) => {
                                            return <div>{`${value}`}</div>;
                                        })}
                                    </div>
                                )}
                            </div>
                        </DisclosurePanel>
                    </Disclosure>
                </div>
            ),
        },
        {
            Header: t('updated_at'),
            accessor: 'updated_at',
            visible: true,
            Cell: ({ row }) => (
                <div className="align-top">
                    {moment(row?.original?.updated_at).format(
                        'YYYY-MM-DD hh:mm A'
                    )}
                </div>
            ),
        },
    ];
    return (
        <div>
            {subTable && (
                <div className="w-full">
                    <Disclosure>
                        <DisclosureButton className=" mb-3 ml-auto group flex items-center gap-2 text-brand hover:cursor-pointer hover:underline">
                            {t(subTable)}
                            <ChevronDownIcon className="w-5 group-data-[open]:rotate-180" />
                        </DisclosureButton>
                        <DisclosurePanel>
                            <DataTable
                                permissionModule="activity-log"
                                columns={tableColumns}
                                hideColumn
                                url={route(subUrl, id)}
                                hideActions
                                hideExport
                                primaryKey={'id'}
                                h="auto"
                                placeholderLength={1}
                                classTd=" align-top"
                                hideFilter={false}
                            />
                        </DisclosurePanel>
                    </Disclosure>
                </div>
            )}
            <DataTable
                permissionModule="activity-log"
                columns={tableColumns}
                url={route(url, id)}
                hideActions
                hideExport
                primaryKey={'id'}
                h="h-[35vh]"
                placeholderLength={5}
                classTd=" align-top"
            />
        </div>
    );
};

export default LogActivity;
