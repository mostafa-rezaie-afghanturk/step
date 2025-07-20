import { useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import AvatarEditorComponent from '@/Components/Cropper/AvatarEditorComponent';
import HTTPClient from '@/lib/HTTPClient';
import { onSuccess } from '@/lib/appAlert';
import { useTranslation } from 'react-i18next';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    url = route('profile.edit'),
    isPortalUser = false,
}) {
    const user = usePage().props.auth.user;
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [deleteImage, setDeleteImage] = useState(false);
    const { t } = useTranslation();

    const [preview, setPreview] = useState(
        user.profile_picture
            ? user.profile_picture.includes('assets')
                ? `/${user.profile_picture}`
                : `/storage/${user.profile_picture}`
            : 'assets/img/profile_user.jpg'
    );

    const { data, setData, errors, recentlySuccessful } = useForm({
        name: user.name,
        ...(isPortalUser ? { username: user.username } : { email: user.email }),
    });

    const submit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const formDataURL = new FormData();
            formDataURL.append('name', data.name);
            if (isPortalUser) {
                formDataURL.append('username', data.username);
            } else {
                formDataURL.append('email', data.email);
            }
            if (image) {
                formDataURL.append('profile_picture', image);
            }
            if (deleteImage) {
                formDataURL.append('profile_picture', null);
            }
            const res = await HTTPClient.post(url, formDataURL, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.result) {
                onSuccess('Profile Info Successfully Updated !');
                setLoading(false);
            }
        } catch (error) {
            setLoading(false);
        }
    };

    return (
        <div>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    {t('profile_information')}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                    {t('update_profile_info_description')}
                </p>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="order-2 md:order-1 md:col-span-8">
                    <section className={className}>
                        <form
                            onSubmit={submit}
                            className="mt-6 "
                            // encType="multipart/form-data"
                        >
                            <div>
                                <InputLabel htmlFor="name" value={t('name')} />

                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={e =>
                                        setData('name', e.target.value)
                                    }
                                    required
                                    isFocused
                                    autoComplete="name"
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.name}
                                />
                            </div>

                            <div className="mt-2">
                                <InputLabel
                                    htmlFor={
                                        isPortalUser ? 'username' : 'email'
                                    }
                                    value={
                                        isPortalUser
                                            ? t('username')
                                            : t('email')
                                    }
                                />

                                <TextInput
                                    id={isPortalUser ? 'username' : 'email'}
                                    type={isPortalUser ? 'text' : 'email'}
                                    className="mt-1 block w-full disabled:bg-gray-100"
                                    value={
                                        isPortalUser
                                            ? user.username
                                            : data.email
                                    }
                                    onChange={e =>
                                        setData(
                                            isPortalUser ? 'username' : 'email',
                                            e.target.value
                                        )
                                    }
                                    required
                                    autoComplete={
                                        isPortalUser ? 'username' : 'email'
                                    }
                                    disabled
                                />

                                <InputError
                                    className="mt-2"
                                    message={errors.username}
                                />
                            </div>

                            {!mustVerifyEmail &&
                                user.email_verified_at === null && (
                                    <div>
                                        <p className="text-sm mt-2 text-gray-800">
                                            {t('email_unverified')}
                                            <Link
                                                href={route(
                                                    'verification.send'
                                                )}
                                                method="post"
                                                as="button"
                                                className="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                {t('resend_verification_email')}
                                            </Link>
                                        </p>

                                        {status ===
                                            'verification-link-sent' && (
                                            <div className="mt-2 font-medium text-sm text-green-600">
                                                {t('verification_link_sent')}
                                            </div>
                                        )}
                                    </div>
                                )}

                            <div className="flex items-center gap-4 mt-6">
                                <PrimaryButton disabled={loading}>
                                    {t('save')}
                                </PrimaryButton>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-gray-600">
                                        {t('saved')}
                                    </p>
                                </Transition>
                            </div>
                        </form>
                    </section>
                </div>

                <div className="order-1 md:order-2 md:col-span-4 flex justify-center items-center">
                    <AvatarEditorComponent
                        setImage={setImage}
                        preview={preview}
                        setPreview={setPreview}
                        showDeleteBtn={
                            preview.includes('assets') ? false : true
                        }
                        setDeleteImage={setDeleteImage}
                    />
                </div>
            </div>
        </div>
    );
}
