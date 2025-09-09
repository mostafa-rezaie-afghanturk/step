// resources/js/Pages/Permissions/Create.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next'; // Added import

const Create = ({ fields }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation(); // Initialized t function

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, post, processing, errors } = useForm(initialData);

    const handleSubmit = e => {
        e.preventDefault();
        post(route('permissions.store'));
    };

    return (
        <AuthenticatedLayout>
            <div className="flex justify-between">
                <div></div>
                <div>
                    {hasPermission('permissions create') && (
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
                                t('save') // Replaced hard-coded text
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

export default Create;
