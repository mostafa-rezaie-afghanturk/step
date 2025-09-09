// resources/js/Pages/Schools/Create.jsx
import React, { useState } from 'react';
import Input from '@/Components/ui/form/Input';
import Label from '@/Components/ui/form/Label';
import { router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import { onError } from '@/lib/appAlert';
import { Inertia } from '@inertiajs/inertia';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import Checkbox from '@/Components/ui/form/Checkbox';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/Hooks/usePermission';

const Create = ({ fields, role, permissions }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, processing, errors } = useForm({
        ...initialData,
        permissions: selectedPermissions,
    });

    const handleCheckboxChange = permission => {
        if (selectedPermissions.includes(permission)) {
            setSelectedPermissions(
                selectedPermissions.filter(p => p !== permission)
            );
        } else {
            setSelectedPermissions([...selectedPermissions, permission]);
        }
    };

    const handleSubmit = e => {
        e.preventDefault();

        if (!selectedPermissions.length) {
            return onError(t('error_select_permission'));
        }

        router.post(route('roles.store'), {
            ...data,
            permissions: selectedPermissions,
        });
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between">
                    <div></div>
                    <div>
                        {hasPermission('roles create') && (
                            <Button
                                onClick={handleSubmit}
                                type="submit"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        {' '}
                                        <ReactLoading
                                            color={'#fff'}
                                            type="bars"
                                            height={20}
                                            width={20}
                                        />{' '}
                                         
                                    </>
                                ) : (
                                    t('save')
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                <Container>
                    <form onSubmit={handleSubmit}>
                        <FormFieldsMapper
                            fields={fields}
                            data={data}
                            setData={setData}
                            errors={errors}
                        />
                        <div className="px-4 grid md:grid-cols-2 lg:grid-cols-4">
                            {Object.keys(permissions).map(module => (
                                <div className="pb-8" key={module}>
                                    <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
                                        {t(module)}
                                    </h3>
                                    <div className="grid">
                                        {permissions[module].map(permission => (
                                            <label
                                                key={permission.id}
                                                className="flex items-center gap-x-2"
                                            >
                                                <Checkbox
                                                    value={permission.name}
                                                    checked={selectedPermissions.includes(
                                                        permission.name
                                                    )}
                                                    onChange={() =>
                                                        handleCheckboxChange(
                                                            permission.name
                                                        )
                                                    }
                                                />
                                                <span className="text-gray-600">
                                                    {t(permission.name)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                </Container>
            </AuthenticatedLayout>
        </>
    );
};

export default Create;
