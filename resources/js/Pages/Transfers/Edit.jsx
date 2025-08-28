import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { usePermission } from '@/hooks/usePermission';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Button from '@/Components/ui/form/Button';
import ButtonLink from '@/Components/ui/form/ButtonLink';
import Input from '@/Components/ui/form/Input';
import Select from '@/Components/ui/form/Select';
import Textarea from '@/Components/ui/form/Textarea';
import { IoArrowBack, IoSave } from 'react-icons/io5';

const Edit = ({ transfer, users }) => {
    const { t } = useTranslation();
    const { hasPermission } = usePermission();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        from_user_id: transfer.from_user_id?.toString() || '',
        to_user_id: transfer.to_user_id?.toString() || '',
        transfer_date: transfer.transfer_date || new Date().toISOString().split('T')[0],
        notes: transfer.notes || '',
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear errors for this field
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: null
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await router.put(route('asset-transfer.update', transfer.transfer_transaction_id), formData, {
                onError: (errors) => {
                    setErrors(errors);
                    setLoading(false);
                },
                onSuccess: () => {
                    setLoading(false);
                }
            });
        } catch (error) {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.from_user_id &&
            formData.to_user_id &&
            formData.transfer_date;
    };

    if (!hasPermission('asset-transfer edit')) {
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

    if (transfer.return_status === 'Returned') {
        return (
            <AuthenticatedLayout>
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-gray-900">
                                <div className="flex items-center gap-4 mb-6">
                                    <ButtonLink
                                        href={route('asset-transfer.show', transfer.transfer_transaction_id)}
                                        className="flex items-center gap-2"
                                        outline
                                    >
                                        <IoArrowBack />
                                        {t('back')}
                                    </ButtonLink>
                                    <h2 className="text-2xl font-semibold">{t('edit_transfer')}</h2>
                                </div>
                                <p className="text-red-600">{t('cannot_edit_returned_transfer')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title={t('edit_transfer')} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex items-center gap-4 mb-6">
                                <ButtonLink
                                    href={route('asset-transfer.show', transfer.transfer_transaction_id)}
                                    className="flex items-center gap-2"
                                    outline
                                >
                                    <IoArrowBack />
                                    {t('back')}
                                </ButtonLink>
                                <h2 className="text-2xl font-semibold">{t('edit_transfer')}</h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('from_user')} *
                                        </label>
                                        <Select
                                            value={formData.from_user_id}
                                            onChange={(value) => handleInputChange('from_user_id', value)}
                                            options={users.map(user => ({
                                                value: user.id,
                                                label: `${user.name} (${user.email})`
                                            }))}
                                            placeholder={t('select_from_user')}
                                            error={errors.from_user_id}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            {t('to_user')} *
                                        </label>
                                        <Select
                                            value={formData.to_user_id}
                                            onChange={(value) => handleInputChange('to_user_id', value)}
                                            options={users
                                                .filter(user => user.id != formData.from_user_id)
                                                .map(user => ({
                                                    value: user.id,
                                                    label: `${user.name} (${user.email})`
                                                }))}
                                            placeholder={t('select_to_user')}
                                            error={errors.to_user_id}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('transfer_date')} *
                                    </label>
                                    <Input
                                        type="date"
                                        value={formData.transfer_date}
                                        onChange={(e) => handleInputChange('transfer_date', e.target.value)}
                                        error={errors.transfer_date}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        {t('notes')}
                                    </label>
                                    <Textarea
                                        value={formData.notes}
                                        onChange={(e) => handleInputChange('notes', e.target.value)}
                                        placeholder={t('enter_notes_optional')}
                                        rows={4}
                                        error={errors.notes}
                                    />
                                </div>

                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">{t('asset_information')}</h4>
                                    <div className="text-sm text-gray-600">
                                        <p><strong>{t('asset_type')}:</strong> {
                                            transfer.asset_or_material_type === 'App\\Models\\FixtureFurnishing'
                                                ? t('fixture_furnishing')
                                                : t('educational_material')
                                        }</p>
                                        <p><strong>{t('asset_code')}:</strong> {transfer.asset_or_material?.asset_code}</p>
                                        <p><strong>{t('asset_name')}:</strong> {
                                            transfer.asset_or_material ?
                                                `${transfer.asset_or_material.group} - ${transfer.asset_or_material.subgroup}` :
                                                '-'
                                        }</p>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <ButtonLink
                                        href={route('asset-transfer.show', transfer.transfer_transaction_id)}
                                        outline
                                    >
                                        {t('cancel')}
                                    </ButtonLink>
                                    <Button
                                        type="submit"
                                        disabled={!isFormValid() || loading}
                                        className="flex items-center gap-2"
                                    >
                                        <IoSave />
                                        {loading ? t('updating') : t('update')}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
