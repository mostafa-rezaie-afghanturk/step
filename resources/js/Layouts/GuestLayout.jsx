import { Button } from '@headlessui/react';
import { useTranslation } from 'react-i18next';

export default function Guest({ children }) {
    const { i18n, t } = useTranslation();

    const changeLanguage = lang => {
        i18n.changeLanguage(lang);
    };

    const langs = [
        {
            id: 'en',
            name: 'EN',
        },
        {
            id: 'tr',
            name: 'TR',
        },
        {
            id: 'fa',
            name: 'FA',
        },
        {
            id: 'ar',
            name: 'AR',
        },
        {
            id: 'az',
            name: 'AZ',
        },
        {
            id: 'fr',
            name: 'FR',
        },

        {
            id: 'So',
            name: 'SO',
        },
        {
            id: 'es',
            name: 'ES',
        },
        {
            id: 'ky',
            name: 'KY',
        },
        {
            id: 'ru',
            name: 'RU',
        },
    ];

    return (
        <div className="flex min-h-screen bg-[#F4F5F5]">
            {/* Left Side (Image and Branding) */}
            <div className="rtl:order-2 hidden lg:block">
                <img
                    src={`/assets/illustrations/covers/${i18n.language}.svg`}
                    alt="Library Illustration"
                    className={`
                        object-cover
                        h-screen
                        w-full
                        -ms-4
                        rtl:-ms-0 rtl:-me-4
                    `}
                    onError={e => {
                        e.target.onerror = null; // Prevents infinite loop if fallback image also fails
                        e.target.src = '/assets/illustrations/covers/en.svg'; // Fallback image path
                    }}
                />
            </div>

            <div className="flex flex-col gap-28 flex-auto">
                {/* Language Selection */}
                <div
                    className="mt-4 flex justify-end gap-x-2 text-[#115DAB] text-sm transition-all duration-300 px-8 lg:px-24"
                    style={{ direction: 'ltr' }}
                >
                    {langs.map(lang => {
                        return (
                            <Button
                                onClick={() => changeLanguage(lang.id)}
                                key={lang.id}
                                className="underline mx-1 hover:text-brand hover:-translate-y-1 hover:font-semibold transition-all duration-300 py-2"
                            >
                                {lang.name}
                            </Button>
                        );
                    })}
                </div>
                {/* Right Side (Login Form) */}
                <div className="flex flex-col items-center justify-center w-full lg:w-full px-8 lg:px-24 ">
                    <div className="w-full max-w-md lg:max-w-lg">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
