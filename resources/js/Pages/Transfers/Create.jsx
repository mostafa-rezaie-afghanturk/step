import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Container from '@/Components/ui/Container';
import ReactLoading from 'react-loading';
import Button from '@/Components/ui/form/Button';
import FormFieldsMapper from '@/Components/ui/form/FormFieldsMapper';
import { usePermission } from '@/Hooks/usePermission';
import { useTranslation } from 'react-i18next';

const Create = ({ users, fixtures, materials }) => {
    const { hasPermission } = usePermission();
    const { t } = useTranslation();





    const initialData = {
        from_user_id: '',
        to_user_id: '',
        asset_or_material_type: '',
        asset_or_material_id: '',
        transfer_date: new Date().toISOString().split('T')[0],
        notes: '',
    };

    const { data, setData, post, processing, errors } = useForm(initialData);

    const getFields = () => [
        {
            name: 'from_user_id',
            label: 'from_user',
            type: 'select',
            required: true,
            options: (users || []).map(user => ({
                value: user.id,
                label: `${user.name} (${user.email})`
            })),
            placeholder: 'select_from_user'
        },
        {
            name: 'to_user_id',
            label: 'to_user',
            type: 'select',
            required: true,
            options: (users || [])
                .filter(user => user.id != data.from_user_id)
                .map(user => ({
                    value: user.id,
                    label: `${user.name} (${user.email})`
                })),
            placeholder: 'select_to_user'
        },
        {
            name: 'asset_or_material_type',
            label: 'asset_type',
            type: 'select',
            required: true,
            options: [
                { value: 'App\\Models\\FixtureFurnishing', label: 'fixtures_furnishings' },
                { value: 'App\\Models\\EducationalMaterial', label: 'educational_materials' }
            ],
            placeholder: 'select_asset_type'
        },
        {
            name: 'asset_or_material_id',
            label: 'asset_material',
            type: 'select',
            required: true,
            options: data.asset_or_material_type ?
                (data.asset_or_material_type === 'App\\Models\\FixtureFurnishing' ? 
                    (fixtures || []).map(asset => ({
                        value: asset.asset_code,
                        label: `${asset.group || ''} - ${asset.subgroup || ''} (${asset.asset_code})`
                    })) :
                    (materials || []).map(asset => ({
                        value: asset.asset_code,
                        label: `${asset.group || ''} - ${asset.subgroup || ''} (${asset.asset_code})`
                    }))
                ) : [],
            placeholder: 'select_asset_material',
            disabled: !data.asset_or_material_type
        },
        {
            name: 'transfer_date',
            label: 'transfer_date',
            type: 'date',
            required: true
        },
        {
            name: 'notes',
            label: 'notes',
            type: 'text',
            required: false,
            placeholder: 'enter_notes_optional'
        }
    ];

    // Clear to_user_id when from_user_id changes to prevent self-transfer
    React.useEffect(() => {
        if (data.from_user_id && data.to_user_id === data.from_user_id) {
            setData('to_user_id', '');
        }
    }, [data.from_user_id, data.to_user_id]);

    // Clear asset selection when asset type changes
    React.useEffect(() => {
        if (data.asset_or_material_id) {
            setData('asset_or_material_id', '');
        }
    }, [data.asset_or_material_type]);

    const handleSubmit = e => {
        e.preventDefault();
        post(route('asset-transfer.store'));
    };

    if (!hasPermission('asset-transfer create')) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p className="text-red-600">{t('access_denied')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Check if we have the required data
    if (!users || users.length === 0) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p className="text-red-600">{t('no_users_available')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!fixtures || fixtures.length === 0) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p className="text-red-600">{t('no_fixtures_available')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    if (!materials || materials.length === 0) {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <p className="text-red-600">{t('no_materials_available')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <>
            <AuthenticatedLayout>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold">
                            {t('create_transfer')}
                        </h1>
                    </div>
                    <div id="saveasset-transfer">
                        {hasPermission('asset-transfer create') && (
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
                    <div id="createasset-transfer">
                        <form onSubmit={handleSubmit}>
                            <FormFieldsMapper
                                fields={getFields()}
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
