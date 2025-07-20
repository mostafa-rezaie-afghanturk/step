import { langs } from '@/Components/Dashboard/navbar';
import { Logo } from '@/Layouts/AuthenticatedLayout';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import { GlobeAltIcon } from '@heroicons/react/20/solid';
import { Link, router, usePage } from '@inertiajs/react';
import { IconFlame } from '@tabler/icons-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LuCircleDashed } from 'react-icons/lu';
import Notification from './Notification';
import NotificationDrawer from './NotificationsDrawer';

const Header = ({ totalBooksRead }) => {
    const { url } = usePage();
    const { i18n, t } = useTranslation();
    let valueLang = i18n.language;
    const numberOfReadBooks = totalBooksRead;
    const user = usePage().props.auth.user;

    if (!langs.some(lang => lang.short === valueLang)) {
        valueLang = 'en';
        i18n.changeLanguage('en');
    }

    const isActive = path => {
        return url.startsWith(path) && url.endsWith(path);
    };

    const changeLanguage = lang => {
        i18n.changeLanguage(lang);
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <header className="header sticky top-0 z-20">
            <nav className="rounded-b-xl max-w-7xl mx-auto py-5 px-4 sm:px-6 bg-white shadow flex justify-between items-center">
                <ul className="items-center gap-x-4 sm:gap-x-6  lg:hidden">
                    <li>
                        <Logo hideLabel />
                    </li>
                </ul>
                <ul className="items-center gap-x-4 sm:gap-x-6 hidden lg:flex">
                    <li>
                        <Logo hideLabel />
                    </li>
                    <li>
                        <Link
                            href={route('portal')}
                            className={`${isActive('/') ? 'text-brand' : 'text-gray-800'} hover:text-brand transition-colors`}
                        >
                            {t('Home')}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route('portal.announcements.index')}
                            className={`${isActive('/announcements') ? 'text-brand' : 'text-gray-800'} hover:text-brand transition-colors`}
                        >
                            {t('Announcements')}
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={route('portal.contact')}
                            className={`${isActive('/contact') ? 'text-brand' : 'text-gray-800'} hover:text-brand transition-colors`}
                        >
                            {t('Contact')}
                        </Link>
                    </li>
                </ul>
                <ul className="flex items-center ms-auto">
                    <li className="me-1">
                        {isMobile ? <NotificationDrawer /> : <Notification />}
                    </li>
                    <li className="me-4">
                        <Popover className="relative">
                            {({ close }) => (
                                <>
                                    <PopoverButton className="py-1 px-2 hover:bg-gray-100 focus:outline-none rounded-md inline-flex items-center gap-x-2">
                                        <GlobeAltIcon className="h-5 w-5 inline-block text-gray-500" />
                                        {
                                            langs.find(
                                                lang => lang.short === valueLang
                                            ).name
                                        }
                                    </PopoverButton>
                                    <PopoverPanel
                                        transition
                                        className={`absolute ${
                                            i18n.dir() === 'rtl'
                                                ? 'left-0'
                                                : 'right-0'
                                        } mt-2 w-48 bg-white rounded-md shadow-lg z-10 origin-top flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
                                    >
                                        <div className="p-2">
                                            {langs.map((item, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => {
                                                        changeLanguage(
                                                            item.short
                                                        );
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
                    </li>
                    <li>
                        <div className="bg-brand/5 flex items-center px-2 py-1 rounded-lg gap-x-2">
                            {numberOfReadBooks === 0 ? (
                                <div className="relative group">
                                    <div className="hover:bg-brand/10 rounded-lg flex items-center px-2 py-1.5 gap-x-2 cursor-pointer">
                                        <LuCircleDashed className="h-6 w-6 stroke-red-500" />
                                        <h4 className="text-red-500">
                                            {numberOfReadBooks}
                                        </h4>
                                    </div>
                                    <div className="absolute -bottom-[150%] right-0 bg-white shadow rounded min-w-40 py-2 px-3 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:-bottom-[110%] transition-all duration-200">
                                        <p className="text-sm text-red-400">
                                            You have not read any book yet!
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative group">
                                    <div className="hover:bg-brand/10 rounded-lg flex items-center px-2 py-1.5 gap-x-2 cursor-pointer">
                                        <div className="p-1 rounded-full bg-red-300">
                                            <IconFlame className="h-4 w-4 fill-white stroke-white" />
                                        </div>
                                        <h4 className="text-red-400 font-bold">
                                            {numberOfReadBooks}
                                        </h4>
                                    </div>
                                    <div className="absolute -bottom-[150%] right-0 bg-white shadow rounded min-w-40 py-2 px-3 whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 group-hover:-bottom-[110%] transition-all duration-200">
                                        <p className="text-sm text-green-500">
                                            Cheers! You have read{' '}
                                            {numberOfReadBooks} book
                                            {numberOfReadBooks > 1 ? 's' : ''}!
                                        </p>
                                    </div>
                                </div>
                            )}
                            <Popover className="relative">
                                <PopoverButton className="flex items-center justify-start gap-2 group/sidebar py-2 rounded-lg h-8 w-8 outline-brand outline-offset-2 shadow-sm">
                                    <img
                                        src={
                                            user.profile_picture
                                                ? user.profile_picture.includes(
                                                      'assets'
                                                  )
                                                    ? `/${user.profile_picture}`
                                                    : `/storage/${user.profile_picture}`
                                                : 'assets/img/profile_user.jpg'
                                        }
                                        className="h-8 w-8 flex-shrink-0 rounded-lg outline-none"
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
                                    className={`absolute ${
                                        i18n.dir() === 'rtl'
                                            ? 'left-0'
                                            : 'right-0'
                                    } mt-2 w-48 bg-white rounded-md shadow-lg z-10 origin-top flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
                                >
                                    <div className="p-4">
                                        <Link
                                            href={route('portal.profile.index')}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded"
                                        >
                                            {t('profile')}
                                        </Link>

                                        <Link
                                            href={route('portal')}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded lg:hidden"
                                        >
                                            {t('Home')}
                                        </Link>

                                        <Link
                                            href={route(
                                                'portal.announcements.index'
                                            )}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded lg:hidden"
                                        >
                                            {t('Announcements')}
                                        </Link>

                                        <Link
                                            href={route('portal.contact')}
                                            className="block px-4 py-2 text-gray-800 hover:bg-gray-100 rounded lg:hidden"
                                        >
                                            {t('Contact')}
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
                    </li>
                    <li></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;
