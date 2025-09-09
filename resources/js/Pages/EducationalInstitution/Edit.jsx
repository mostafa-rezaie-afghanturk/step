// resources/js/Pages/educational-institutions/Edit.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next'; // Added

const Edit = ({ institution, fields }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation(); // Added

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = e => {
        e.preventDefault();
        put(
            route('educational-institutions.update', institution.institution_id)
        );
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('edit_institution')}
                        </h1>
                    </div>
                    <div>
                        {hasPermission('educational-institutions write') && (
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
                                    t('save') // Changed
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
        </>
    );
};

export default Edit;
