import React from 'react';
import { router, useForm } from '@inertiajs/react';
import Label from '@/Components/ui/form/Label';
import Button from '@/Components/ui/form/Button';
import { useTranslation } from 'react-i18next';
import PasswordInput from '@/Components/ui/form/PasswordInput';
import GuestLayout from '@/Layouts/GuestLayout';

export default function ChangePassword() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = e => {
        e.preventDefault();
        post(route('password.force-update'));
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <GuestLayout>
            <div className="max-w-4xl mx-auto flex justify-center items-center">
                <div className="w-full">
                    <h2 className="text-lg font-semibold mb-4">
                        {t('change_password')}
                    </h2>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <p className="text-yellow-700">
                            {t('password_change_required')}
                        </p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <Label
                                    text={t('new_password')}
                                    htmlFor="password"
                                    required
                                />
                                <PasswordInput
                                    id="password"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={data.password}
                                    onChange={e =>
                                        setData('password', e.target.value)
                                    }
                                />
                                {errors.password && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {t(errors.password)}
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label
                                    text={t('confirm_password')}
                                    htmlFor="password_confirmation"
                                    required
                                />
                                <PasswordInput
                                    id="password_confirmation"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    value={data.password_confirmation}
                                    onChange={e =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value
                                        )
                                    }
                                />
                            </div>

                            <div className="flex justify-between">
                                <Button
                                    type="button"
                                    outline
                                    onClick={handleLogout}
                                    tabIndex="-1"
                                >
                                    {t('logout')}
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {t('change_password')}
                                </Button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
