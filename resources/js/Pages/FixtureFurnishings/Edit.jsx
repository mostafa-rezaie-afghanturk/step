// resources/js/Pages/FixtureFurnishings/Edit.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Edit = ({ fixtureFurnishing, fields }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();

    const initialData = fields.reduce((acc, field) => {
        if (field.type === 'boolean') {
            acc[field.name] = field.default ?? false;
        } else {
            acc[field.name] = field.default ?? '';
        }
        return acc;
    }, {});

    const { data, setData, put, processing, errors } = useForm(initialData);

    const handleSubmit = e => {
        e.preventDefault();
        put(route('fixture-furnishings.update', fixtureFurnishing.fixture_furnishing_id));
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{t('edit_fixture_furnishing')}</h1>
                    </div>
                    <div>
                        {hasPermission('fixture-furnishings edit') && (
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
