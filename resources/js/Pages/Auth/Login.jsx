import Checkbox from '@/Components/Checkbox';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import Button from '@/Components/ui/form/Button';
import { useTranslation } from 'react-i18next';
import PasswordInput from '@/Components/ui/form/PasswordInput';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        input_type: '',
        password: '',
        remember: false,
    });

    const submit = e => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const { t } = useTranslation();

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                {/* add title */}
                {/* <h1 className="text-3xl font-extrabold text-gray-900 mb-4 sm:mb-6">
                    {t('loginPage.login')}
                </h1> */}

                <div>
                    <InputLabel
                        htmlFor="email"
                        value={t('login_page.email/username')}
                        className="mb-1"
                    />

                    <TextInput
                        id="input_type"
                        name="input_type"
                        value={data.input_type}
                        className="w-full border-none bg-[#C7E7E9] px-4 py-2 placeholder-[#0856A8] focus:ring focus:!ring-blue-300 focus:outline-none"
                        autoComplete="username"
                        isFocused={true}
                        onChange={e => setData('input_type', e.target.value)}
                        placeholder={t('login_page.enter your email/username')}
                    />

                    <InputError message={errors.email ? t(`login_page.${errors.email}`) : ""} className="mt-2" />
                    <InputError message={errors.username ? t(`login_page.${errors.username}`) : ""} className="mt-2" />
                </div>

                <div className="mt-4 lg:mt-6">
                    <InputLabel
                        htmlFor="password"
                        value={t('login_page.Password')}
                        className="mb-1"
                    />

                    <PasswordInput
                        id="password"
                        name="password"
                        value={data.password}
                        className="rounded w-full border-none bg-[#C7E7E9] px-4 py-2 placeholder-[#0856A8] focus:ring focus:ring-blue-300 focus:outline-none"
                        autoComplete="current-password"
                        onChange={e => setData('password', e.target.value)}
                        placeholder={t('login_page.enter your password')}
                    />

                    <InputError message={errors.password ? t(`login_page.${errors.password}`) : ""} className="mt-2" />
                </div>

                <div className="block mt-4 lg:mt-6">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={e =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-[#115DAB]">
                            {t('login_page.remember_me')}
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-between mt-4">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="underline text-sm text-[#115DAB] hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('login_page.forgot_your_password')}
                        </Link>
                    )}

                    <Button
                        className="ms-4 bg-brand"
                        disabled={processing}
                        type="submit"
                        loading={processing}
                    >
                        {t('login_page.log_in')}
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
