// resources/js/Pages/FixtureFurnishings/Create.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Create = ({ fields }) => {
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

    const { data, setData, post, processing, errors } = useForm({
        ...initialData,
        location_type: 'Room',
    });

    const handleSubmit = e => {
        e.preventDefault();
        post(route('educational-materials.store'));
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('create_educational_material')}
                        </h1>
                    </div>
                    <div id="savefixturefurnishings">
                        {hasPermission('educational-materials create') && (
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
                    <div id="createfixturefurnishings">
                        <form onSubmit={handleSubmit}>
                            <FormFieldsMapper
                                fields={fields}
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        </form>
                    </div>
                </Container>
            </AuthenticatedLayout>
        </>
    );
};

export default Create;
