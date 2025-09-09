import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import { router, useForm } from '@inertiajs/react';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { onError } from '@/lib/appAlert';
import Checkbox from '@/Components/ui/form/Checkbox';
import Button from '@/Components/ui/form/Button';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/Hooks/usePermission';

const EditRole = ({ fields, role, permissions, rolePermissions }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const [selectedPermissions, setSelectedPermissions] =
        useState(rolePermissions);

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, errors, processing } = useForm({
        ...initialData,
        permissions: rolePermissions,
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

        router.put(route('roles.update', role.id), {
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
                        {hasPermission('roles write') && (
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
                    <div className="">
                        <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                            {t('edit_role')}: {role.name}
                        </h1>
                        <form onSubmit={handleSubmit}>
                            {/* <FormFieldsMapper
                                fields={fields}
                                data={data}
                                setData={setData}
                                errors={errors}
                            /> */}
                            <div className="px-4 grid md:grid-cols-2 lg:grid-cols-4">
                                {Object.keys(permissions).map(module => (
                                    <div className="pb-8" key={module}>
                                        <h3 className="text-lg font-semibold text-gray-700 mb-4 capitalize">
                                            {t(module)}
                                        </h3>
                                        <div className="grid">
                                            {permissions[module].map(
                                                permission => (
                                                    <label
                                                        key={permission.id}
                                                        className="flex items-center gap-x-2"
                                                    >
                                                        <Checkbox
                                                            value={
                                                                permission.name
                                                            }
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
                                                            {t(
                                                                `permission.${
                                                                    permission.name.split(
                                                                        ' '
                                                                    )[1]
                                                                }`
                                                            )}
                                                        </span>
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </form>
                    </div>
                </Container>
            </AuthenticatedLayout>
        </>
    );
};

export default EditRole;
