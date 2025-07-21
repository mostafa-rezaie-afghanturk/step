import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { Link, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Notification from './Notification';
import { GlobeAltIcon } from '@heroicons/react/20/solid';

export const langs = [
    { short: 'en', name: 'English' },
    { short: 'tr', name: 'Türkçe' },
    { short: 'fa', name: 'فارسی' },
    { short: 'fr', name: 'Français' },
    { short: 'ar', name: 'العربية' },
    { short: 'so', name: 'Somali' },
    { short: 'es', name: 'Español' },
    { short: 'az', name: 'Azərbaycan' },
    { short: 'ky', name: 'Кыргызча' },
    { short: 'ru', name: 'Русский' },
];

export default function Navbar() {
    const { i18n, t } = useTranslation();
    let valueLang = i18n.language;
    const user = usePage().props.auth.user;

    if (!langs.some(lang => lang.short === valueLang)) {
        valueLang = 'en';
        i18n.changeLanguage('en');
    }

    const changeLanguage = lang => {
        i18n.changeLanguage(lang);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        <nav className="bg-white  p-1 sm:flex justify-between items-center ">
            <div className="flex items-center flex-wrap justify-end px-10 gap-x-4 w-full">
                <Popover className="relative">
                    {({ close }) => (
                        <>
                            <PopoverButton className="py-1 px-2 hover:bg-gray-100 focus:outline-none rounded-md inline-flex items-center gap-x-2">
                                <GlobeAltIcon className="h-5 w-5 inline-block text-gray-500" />
                                {
                                    langs.find(lang => lang.short == valueLang)
                                        .name
                                }
                            </PopoverButton>
                            <PopoverPanel
                                transition
                                className={`absolute ${i18n.dir() == 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg z-10 origin-top flex-col transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
                            >
                                <div className="p-2">
                                    {langs.map((item, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                changeLanguage(item.short);
                                                close();
                                            }}
                                            className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 rounded"
                                        >
                                            {item.name}
                                        </button>
                                    ))}
                                </div>
                            </PopoverPanel>
                        </>
                    )}
                </Popover>

                <Notification />

                {/* User Popover */}
                <Popover className="relative">
                    <PopoverButton className="flex items-center justify-start gap-2 group/sidebar">
                        <img
                            src={
                                user?.profile_picture
                                    ? user.profile_picture.includes('assets')
                                        ? `/${user.profile_picture}`
                                        : `/storage/${user.profile_picture}`
                                    : '/assets/img/profile_user.jpg'
                            }
                            className="h-8 w-8 flex-shrink-0 rounded-full border border-gray-400"
                            width={50}
                            height={50}
                            alt="Avatar"
                        />
                        <span
                            className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                            style={{
                                willChange: 'auto',
                                display: 'none',
                                opacity: 0,
                            }}
                        />
                    </PopoverButton>

                    <PopoverPanel
                        transition
                        className={`absolute ${i18n.dir() == 'rtl' ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg z-10 origin-top flex-col transition duration-300 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
                    >
                        <div className="p-4">
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded"
                            >
                                {t('profile')}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-start px-4 py-2 text-gray-800 hover:bg-gray-100 rounded"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    </PopoverPanel>
                </Popover>
            </div>
        </nav>
    );
}
