// resources/js/Pages/lands/Edit.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Edit = ({ transfer, fields }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const initialData = fields.reduce((acc, field) => {
        acc[field.name] = field.default;
        return acc;
    }, {});

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = e => {
        e.preventDefault();
        put(route('asset-transfer.update', transfer.transfer_transaction_id)); // Adjust the URL according to your routes
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{t('edit_transfer')}</h1>
                    </div>
                    <div>
                        {hasPermission('lands write') && (
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
                    </form>
                </Container>
            </AuthenticatedLayout>
        </>
    );
};

export default Edit;
