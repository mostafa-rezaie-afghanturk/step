import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import Label from '@/Components/ui/form/Label';
import Input from '@/Components/ui/form/Input';
import Button from '@/Components/ui/form/Button';
import ReactLoading from 'react-loading';
import { useForm } from '@inertiajs/react';
import { countryListAllIsoData } from '@/lib/countries';
import Select from '@/Components/ui/form/Select';
import { useEffect, useState } from 'react';
import { BUTTON_SIZES, BUTTON_TYPES } from '@/Components/Constants/buttons';
import { IoAddOutline } from 'react-icons/io5';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import { onError } from '@/lib/appAlert';

const Edit = ({ country }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const { data, setData, put, processing, errors } = useForm({
        name: country.name || '',
        country_code: country.country_code || '',
        name_tr: country.name_tr || '',
        name_primary: country.name_primary || '',
        provinces: country.provinces || [],
    });

    const [rows, setRows] = useState(
        country.provinces || [
            {
                province_id: null,
                name: '',
                province_code: '',
            },
        ]
    );

    const handleSubmit = e => {
        e.preventDefault();

        if (data.provinces.length === 0) {
            onError('Please add at least one campus!');
            return;
        }

        // Ensure province_id is included in the data being sent
        const provincesWithId = data.provinces.map(province => ({
            province_id: province.province_id,
            name: province.name,
            province_code: province.province_code,
        }));

        put(route('countries.update', country.country_id), {
            ...data,
            provinces: provincesWithId,
        });
    };

    // Add a new row with default empty values
    const addRow = () => {
        const newRow = {
            province_id: null,
            name: '',
            province_code: '',
        };
        setRows([...rows, newRow]);
        setData('provinces', [...data.provinces, newRow]);
    };

    // Handle input change for a specific row and column
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
        setData('provinces', updatedRows);
    };

    const removeProvince = index => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        setData('provinces', updatedRows);
    };

    const [activeTab, setActiveTab] = useState('country');

    const handleTabClick = tab => {
        setActiveTab(tab);
    };

    const tabs = [
        {
            id: 'country',
            label: (
                <div
                    className={`${
                        Object.keys(errors).some(
                            key => !key.startsWith('provinces')
                        )
                            ? 'text-red-500'
                            : 'text-gray-500'
                    }`}
                >
                    {t('CountryInformation')}
                </div>
            ),
            content: (
                <>
                    {' '}
                    <h2 className="text-lg font-semibold mb-4 sm:mb-6">
                        {t('CountryInformation')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div className="mb-3 ">
                            <Label
                                text={t('Country Name')}
                                htmlFor="name"
                                required={true}
                            />
                            <Select
                                id="name"
                                aria-label="Country Name"
                                className="!h-[38px]"
                                onChange={e => setData('name', e.target.value)}
                                value={data.name}
                            >
                                {countryListAllIsoData.map((item, index) => (
                                    <option value={item.name} key={index}>
                                        {' '}
                                        {item.name}
                                    </option>
                                ))}
                            </Select>
                            {errors.name && (
                                <div className="text-red-500 text-sm px-1">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <Label
                                text={t('Country Code')}
                                htmlFor="country_code"
                                required={true}
                            />
                            <Input
                                id="country_code"
                                value={data.country_code}
                                type="text"
                                onChange={e =>
                                    setData('country_code', e.target.value)
                                }
                                disabled
                            />
                            {errors.country_code && (
                                <div className="text-red-500 text-sm px-1">
                                    {errors.country_code}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                        <div className="mb-3">
                            <Label
                                text={t('TurkeyCountryName')}
                                htmlFor="name_tr"
                                required={true}
                            />
                            <Input
                                id="name_tr"
                                value={data.name_tr}
                                type="text"
                                onChange={e =>
                                    setData('name_tr', e.target.value)
                                }
                            />
                            {errors.name_tr && (
                                <div className="text-red-500 text-sm px-1">
                                    {errors.name_tr}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <Label
                                text={t('Primary Name')}
                                htmlFor="name_primary"
                                required={true}
                            />
                            <Input
                                id="name_primary"
                                value={data.name_primary}
                                type="text"
                                onChange={e =>
                                    setData('name_primary', e.target.value)
                                }
                            />
                            {errors.name_primary && (
                                <div className="text-red-500 text-sm px-1">
                                    {errors.name_primary}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ),
        },
        {
            id: 'provinces',
            label: (
                <div
                    className={`${
                        Object.keys(errors).some(key =>
                            key.startsWith('provinces')
                        )
                            ? 'text-red-500'
                            : 'text-gray-500'
                    }`}
                >
                    {t('campuses')}
                </div>
            ),
            content: (
                <div
                    id="provinces-info"
                    className="tab-content overflow-x-auto max-w-none "
                >
                    <h2 className="text-lg font-semibold mb-4 sm:mb-6">
                        {t('campuses')}
                    </h2>
                    <div className="overflow-x-auto max-w-full">
                        <div className="overflow-x-auto max-w-full bg-white shadow-sm border rounded-lg">
                            <table className="min-w-full table-auto text-gray-800  border-collapse ">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                            {t('No.')}
                                        </th>
                                        <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                            {t('campus_name')}
                                        </th>
                                        <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                            {t('campus_code')}
                                        </th>
                                        <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                            {t('actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {rows.map((row, index) => (
                                        <tr
                                            key={index}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="text-center text-sm text-gray-900 border">
                                                {index + 1}
                                            </td>
                                            <td className="text-center text-sm text-gray-900 border">
                                                <input
                                                    type="text"
                                                    value={row.name}
                                                    onChange={e =>
                                                        handleInputChange(
                                                            index,
                                                            'name',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-none w-full border-gray-300 p-1"
                                                />
                                                {errors[
                                                    `provinces.${[index]}.name`
                                                ] && (
                                                    <div className="text-red-500 text-sm text-start px-1">
                                                        {
                                                            errors[
                                                                `provinces.${[index]}.name`
                                                            ]
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center text-sm text-gray-900 border">
                                                <input
                                                    type="text"
                                                    value={row.province_code}
                                                    onChange={e =>
                                                        handleInputChange(
                                                            index,
                                                            'province_code',
                                                            e.target.value
                                                        )
                                                    }
                                                    className="border-none w-full border-gray-300 p-1"
                                                />
                                                {errors[
                                                    `provinces.${[index]}.province_code`
                                                ] && (
                                                    <div className="text-red-500 text-sm text-start px-1">
                                                        {
                                                            errors[
                                                                `provinces.${[index]}.province_code`
                                                            ]
                                                        }
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-center text-sm text-gray-900 border">
                                                <button
                                                    type="button"
                                                    className="text-red-500"
                                                    onClick={() =>
                                                        removeProvince(index)
                                                    }
                                                >
                                                    X
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="m-4">
                                <Button
                                    onClick={addRow}
                                    type="button"
                                    buttonType={BUTTON_TYPES.PRIMARY}
                                    icon={<IoAddOutline />}
                                    size={BUTTON_SIZES.SMALL}
                                >
                                    {t('add_compus')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const selectedCountryObj = countryListAllIsoData.find(
            c => c.name === data.name
        );
        setData('country_code', selectedCountryObj?.code || '');
    }, [data.name]);

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between">
                <div></div>
                <div>
                    {hasPermission('countries write') && (
                        <Button
                            onClick={handleSubmit}
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? (
                                <>
                                    <ReactLoading
                                        color={'#fff'}
                                        type="bars"
                                        height={20}
                                        width={20}
                                    />
                                </>
                            ) : (
                                t('Update')
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Container>
                <div>
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                            {tabs.map(tab => (
                                <li className="me-2" key={tab.id}>
                                    <a
                                        href="#"
                                        className={`inline-flex items-center justify-center p-4 border-b-2 ${
                                            activeTab === tab.id
                                                ? 'text-brand border-brand'
                                                : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                                        } rounded-t-lg`}
                                        onClick={() => handleTabClick(tab.id)}
                                    >
                                        {tab.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <form onSubmit={handleSubmit}>
                        {/* Tab Content */}
                        <div className="p-4">
                            {tabs.map(tab =>
                                activeTab === tab.id ? (
                                    <div key={tab.id}>{tab.content}</div>
                                ) : null
                            )}
                        </div>
                    </form>
                </div>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Edit;
