import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import Button from '@/Components/ui/form/Button';
import ReactLoading from 'react-loading';
import { useForm } from '@inertiajs/react';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next'; // Added import

const Edit = ({ fields, permission }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation(); // Initialized t function

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = e => {
        e.preventDefault();
        put(route('permissions.update', permission.id));
    };

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between">
                <div>
                    <h1 className="text-2xl font-semibold mb-6 text-gray-800">
                        {t('edit_permission')}: {permission.name} // Wrapped
                        with t('')
                    </h1>
                </div>
                <div>
                    {hasPermission('permissions write') && (
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
                                t('update') // Replaced hard-coded text
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
                </form>
            </Container>
        </AuthenticatedLayout>
    );
};

export default Edit;
