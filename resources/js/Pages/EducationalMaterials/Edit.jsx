// resources/js/Pages/educationalMaterials/Edit.jsx
import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Edit = ({ educationalMaterial, fields }) => {
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

    const { data, setData, post, processing, errors } = useForm(initialData);

    const handleSubmit = e => {
        e.preventDefault();
        post(route('educational-materials.update', educationalMaterial.educational_material_id));
    };

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">{t('edit_educational_material')}</h1>
                    </div>
                    <div>
                        {hasPermission('educational-materials edit') && (
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
