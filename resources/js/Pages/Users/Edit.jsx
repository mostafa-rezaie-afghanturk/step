import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import Label from '@/Components/ui/form/Label';
import { useForm } from '@inertiajs/react';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import LinkComboBoxSelect from '@/Components/ui/form/LinkComboBoxSelect';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { ACCOUNT_TYPES } from './Create';
import Select from '@/Components/ui/form/Select';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';
import { IoAddOutline } from 'react-icons/io5';
import { BUTTON_SIZES, BUTTON_TYPES } from '@/Components/Constants/buttons';
import { onError } from '@/lib/appAlert';

const EditUser = ({ user, fields, roles, userRestrictions }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();
    const [rows, setRows] = useState(userRestrictions || []);

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    initialData.userRestrictions = rows;

    const { data, setData, put, processing, errors } = useForm({
        ...initialData,
        account_type:
            user.userable_type === 'App\\Models\\Student'
                ? 'student'
                : user.userable_type === 'App\\Models\\ParentModel'
                  ? 'parent'
                  : 'General User',
        associated_id: user.userable_id,
        userRestrictions: userRestrictions || [],
        roles: user.roles.map(role => ({
            label: role.name,
            value: role.id,
        })),
    });

    const checkDuplicateRestrictions = () => {
        const isDuplicate = rows.some(
            (row, index) =>
                rows.findIndex(
                    r =>
                        r.country_id === row.country_id &&
                        r.school_id === row.school_id &&
                        r.library_id === row.library_id
                ) !== index
        );

        if (isDuplicate) {
            onError('Duplicate restriction detected. Please check.');
            return true;
        }
        return false;
    };

    const addRow = () => {
        if (checkDuplicateRestrictions()) {
            return;
        }

        setRows([
            ...rows,
            {
                country_id: null,
                school_id: '',
                library_id: '',
            },
        ]);
        setData('userRestrictions', [
            ...rows,
            {
                country_id: null,
                school_id: '',
                library_id: '',
            },
        ]);
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (checkDuplicateRestrictions()) {
            return;
        }

        if (data.account_type === 'General User') {
            delete data.username;
        } else {
            delete data.email;
        }

        put(route('users.update', user.id));
    };

    const filterFields = fields => {
        return fields.filter(field => {
            if (
                data.account_type === 'General User' &&
                field.name === 'username'
            ) {
                return false;
            }
            if (
                data.account_type !== 'General User' &&
                field.name === 'email'
            ) {
                return false;
            }
            return true;
        });
    };

    const removeUserRestriction = index => {
        const updatedRows = rows.filter((_, i) => i !== index);
        setRows(updatedRows);
        setData('userRestrictions', updatedRows);
    };

    // Handle input change for a specific row and column
    const handleInputChange = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = value;
        setRows(updatedRows);
        setData('userRestrictions', updatedRows);
    };

    const formatErrorMessage = errorKey => {
        if (errorKey.startsWith('userRestrictions')) {
            const parts = errorKey.split('.');
            const index = parseInt(parts[1], 10) + 1; // Convert index to 1-based
            const field = parts[2];

            const fieldNames = {
                country_id: 'Country',
                school_id: 'School',
                library_id: 'Library',
            };

            return `The ${fieldNames[field] || field} field in restriction #${index} is required.`;
        }

        return errorKey; // Default to the original message if no match
    };

    const tabs = [
        {
            id: 'basic',
            label: (
                <div
                    className={`${
                        Object.keys(errors).some(key => !key.startsWith('role'))
                            ? 'text-red-500'
                            : 'text-gray-500'
                    }`}
                >
                    {t('user_information')}
                </div>
            ),
            content: (
                <>
                    <h2 className="text-lg font-semibold mb-2">
                        {t('user_information')}
                    </h2>
                    <FormFieldsMapper
                        fields={filterFields(fields)}
                        data={data}
                        setData={setData}
                        errors={errors}
                    ></FormFieldsMapper>
                </>
            ),
        },
        {
            id: 'authorization',
            label: (
                <div
                    className={`${
                        Object.keys(errors).some(key => key.startsWith('role'))
                            ? 'text-red-500'
                            : 'text-gray-500'
                    }`}
                >
                    {t('authorization')}
                </div>
            ),
            content: (
                <div className="tab-content overflow-x-auto max-w-none">
                    <h2 className="text-lg font-semibold mb-2">
                        {t('permissions')}
                    </h2>
                    <div className="overflow-x-auto max-w-full bg-white shadow-sm border rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                            <div className={`px-4 p-2`}>
                                <Label
                                    text={t('role')}
                                    htmlFor={'role'}
                                    required={true}
                                />
                                <LinkComboBoxSelect
                                    id="role"
                                    defaultValue={
                                        user.roles.map(role => role.id)[0]
                                    }
                                    onChange={options =>
                                        setData('roles', options)
                                    }
                                    url={route('roles.search')}
                                />
                                {errors.roles && (
                                    <div className="text-red-500 text-sm px-1">
                                        {errors.roles}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 sm:mt-8">
                        <h2 className="text-lg font-semibold mb-4 sm:mb-6">
                            {t('Restrictions')}
                        </h2>
                        <div className="overflow-x-auto max-w-full">
                            <div className="overflow-x-auto max-w-full bg-white shadow-sm border rounded-lg">
                                <table className="min-w-full table-auto text-gray-800  border-collapse">
                                    <thead className="bg-gray-100 border-b">
                                        <tr>
                                            <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                                {t('No.')}
                                            </th>
                                            <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                                {t('Country')}
                                            </th>
                                            <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                                {t('School')}
                                            </th>
                                            <th className="p-2 text-start text-sm font-semibold text-gray-700">
                                                {t('Library')}
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
                                                    <LinkComboBoxSelect
                                                        url={route(
                                                            'users.country'
                                                        )}
                                                        onChange={option =>
                                                            handleInputChange(
                                                                index,
                                                                'country_id',
                                                                option?.value
                                                            )
                                                        }
                                                        defaultValue={
                                                            row.country_id
                                                        }
                                                    />
                                                    {errors[
                                                        `userRestrictions.${index}.country_id`
                                                    ] && (
                                                        <div className="text-red-500 text-sm px-1 text-start">
                                                            {formatErrorMessage(
                                                                `userRestrictions.${index}.country_id`
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center text-sm text-gray-900 border">
                                                    <LinkComboBoxSelect
                                                        url={route(
                                                            'users.school'
                                                        )}
                                                        onChange={option =>
                                                            handleInputChange(
                                                                index,
                                                                'school_id',
                                                                option?.value
                                                            )
                                                        }
                                                        dependsOn={{
                                                            country_id:
                                                                row.country_id,
                                                        }}
                                                        defaultValue={
                                                            row.school_id
                                                        }
                                                    />
                                                    {errors[
                                                        `userRestrictions.${index}.school_id`
                                                    ] && (
                                                        <div className="text-red-500 text-sm text-start px-1">
                                                            {
                                                                errors[
                                                                    `userRestrictions.${index}.school_id`
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center text-sm text-gray-900 border">
                                                    <LinkComboBoxSelect
                                                        url={route(
                                                            'users.library'
                                                        )}
                                                        onChange={option =>
                                                            handleInputChange(
                                                                index,
                                                                'library_id',
                                                                option?.value
                                                            )
                                                        }
                                                        dependsOn={{
                                                            school_id:
                                                                row.school_id,
                                                        }}
                                                        defaultValue={
                                                            row.library_id
                                                        }
                                                    />
                                                    {errors[
                                                        `userRestrictions.${index}.library_id`
                                                    ] && (
                                                        <div className="text-red-500 text-sm text-start px-1">
                                                            {
                                                                errors[
                                                                    `userRestrictions.${index}.library_id`
                                                                ]
                                                            }
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="text-center text-sm text-gray-900 border min-w-[30px]">
                                                    <button
                                                        type="button"
                                                        className="text-red-500"
                                                        onClick={() =>
                                                            removeUserRestriction(
                                                                index
                                                            )
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
                                        {t('Add Restriction')}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const [activeTab, setActiveTab] = useState('basic');

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between">
                <div></div>
                <div>
                    {hasPermission('users edit') && (
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
                                t('update')
                            )}
                        </Button>
                    )}
                </div>
            </div>

            <Container>
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <ul className="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500">
                        {tabs.map(tab => (
                            <li className="me-2" key={tab.id}>
                                <a
                                    href="#"
                                    className={`inline-flex items-center justify-center p-4 border-b-2 ${
                                        activeTab === tab.id
                                            ? 'text-blue-600 border-blue-600'
                                            : 'border-transparent hover:text-gray-600 hover:border-gray-300'
                                    } rounded-t-lg`}
                                    onClick={() => setActiveTab(tab.id)}
                                >
                                    {tab.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="p-4">
                        {tabs.map(tab =>
                            activeTab === tab.id ? (
                                <div key={tab.id}>{tab.content}</div>
                            ) : null
                        )}
                    </div>
                </form>
            </Container>
        </AuthenticatedLayout>
    );
};

export default EditUser;
