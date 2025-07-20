import React, { useEffect, useRef, useState } from 'react';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '../CustomComponents/Drawer';
import { FiBell } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { Button, Field, Label, Switch } from '@headlessui/react';
import HTTPClient from '@/lib/HTTPClient';
import RoundedButton from '../ui/RoundedButton';
import { FaTrash } from 'react-icons/fa6';
import { BUTTON_TYPES } from '../Constants/buttons';
import { MdMarkEmailRead } from 'react-icons/md';
import { useNotification } from '@/context/NotificationContext';
// import { echoInstance } from '@/echo';
import { Link, usePage } from '@inertiajs/react';

const CloseIcon = () => {
    return (
        <div className="absolute top-4 right-4 group">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-black dark:text-white h-4 w-4 group-hover:scale-125 group-hover:rotate-3 transition duration-200"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6l-12 12" />
                <path d="M6 6l12 12" />
            </svg>
        </div>
    );
};

const Notification = () => {
    const { mute, setMute } = useNotification();
    const user = usePage().props.auth.user;

    const { i18n, t } = useTranslation();
    const [open, setOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const containerRef = useRef(null);

    const fetchNotifications = async page => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const response = await HTTPClient.get(
                route('notifications.index'),
                { params: { page } }
            );
            if (response.result) {
                const newNotifications = response.notifications.data;
                setNotifications(prevNotifications => {
                    const existingIds = prevNotifications.map(
                        notification => notification.id
                    );
                    const uniqueNotifications = newNotifications.filter(
                        notification => !existingIds.includes(notification.id)
                    );
                    setHasMore(newNotifications.length > 0);
                    return [...prevNotifications, ...uniqueNotifications];
                });
            }
        } catch (error) {
            console.error('Failed to fetch notifications', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id = null) => {
        try {
            const data = await HTTPClient.post(route('notifications.read'), {
                id: id,
            });
            if (data.result) {
                setNotifications(prevNotifications =>
                    prevNotifications.map(notification =>
                        id === null
                            ? {
                                  ...notification,
                                  read_at: new Date().toISOString(),
                              }
                            : notification.id === id
                              ? {
                                    ...notification,
                                    read_at: new Date().toISOString(),
                                }
                              : notification
                    )
                );
            }
        } catch (error) {}
    };

    const deleteNotification = async (id = null) => {
        try {
            const data = await HTTPClient.delete(
                route('notifications.destroy', {
                    id: id,
                })
            );
            if (data.result) {
                if (id) {
                    setNotifications(prevNotifications =>
                        prevNotifications.filter(
                            notification => notification.id !== id
                        )
                    );
                    if (notifications.length < 1) {
                        fetchNotifications();
                    }
                } else {
                    setNotifications([]);
                    fetchNotifications();
                }
            }
        } catch (error) {}
    };

    const handleScroll = () => {
        const container = containerRef.current;
        if (
            container.scrollTop + container.clientHeight >=
            container.scrollHeight
        ) {
            setPage(prevPage => {
                const nextPage = prevPage + 1;
                fetchNotifications(nextPage);
                return nextPage;
            });
        }
    };

    useEffect(() => {
        setHasMore(true);
        setPage(1);
        setNotifications([]);
        if (open) {
            fetchNotifications(page);
        }
    }, [open]);

    useEffect(() => {
        const container = containerRef.current;
        container?.addEventListener('scroll', handleScroll);
        return () => {
            container?.removeEventListener('scroll', handleScroll);
        };
    }, [loading, hasMore]);

    const hrefValue = (title, key) => {
        switch (title) {
            case 'Book Reserved':
                return `/books/details/${key}`;

            default:
                return `/admin/books`;
        }
    };

    return (
        <Drawer
            dismissible={false}
            open={open}
            onOpenChange={setOpen}
            direction={i18n.dir() === 'rtl' ? 'left' : 'right'}
        >
            <DrawerTrigger>
                <div className="relative" onClick={() => setOpen(true)}>
                    <FiBell
                        className="text-gray-600 hover:text-gray-800"
                        size={24}
                    />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                </div>
            </DrawerTrigger>
            <DrawerContent
                className={`md:min-w-[400px] sm:min-w-[300px] text-center ${i18n.dir() === 'rtl' ? 'left-0 rounded-r-[10px]' : 'right-0 rounded-l-[10px]'} `}
            >
                <DrawerHeader>
                    <DrawerTitle className="text-center">
                        <div>{t('Notifications')}</div>
                    </DrawerTitle>
                    <DrawerClose onClick={() => setOpen(prev => !prev)}>
                        <CloseIcon className="mx-4" />
                    </DrawerClose>
                    <div className="flex justify-between mt-2">
                        <Button
                            onClick={() => markAsRead()}
                            className="px-2 rounded-sm text-brand hover:underline"
                        >
                            {t('Mark All Read')}
                        </Button>
                        <Button
                            onClick={() => deleteNotification()}
                            className="px-2 rounded-sm text-red-500 hover:underline"
                        >
                            {t('Delete All')}
                        </Button>
                    </div>
                    <DrawerDescription>
                        <div
                            ref={containerRef}
                            className="h-[calc(100vh-170px)] overflow-auto "
                        >
                            {notifications.map((notification, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between p-3 rounded-lg my-1 ${notification.read_at ? 'bg-slate-50' : 'bg-slate-200'}`}
                                >
                                    <div className="flex items-center">
                                        {/* <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center text-2xl bg-slate-200 overflow-hidden">
                                            N
                                        </div> */}
                                        <div className="ms-1">
                                            <p className="font-medium">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm">
                                                {t(
                                                    'notifications.wantToResrved',
                                                    {
                                                        name: notification.data
                                                            ?.name,
                                                    }
                                                )}
                                                <a
                                                    href={hrefValue(
                                                        notification.title,
                                                        notification.data
                                                            ?.book_id
                                                    )}
                                                    className="text-brand hover:text-black"
                                                >
                                                    {' ' +
                                                        notification.data
                                                            ?.book_title}
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                    <div className=" flex items-center">
                                        {notification.read_at == null && (
                                            <RoundedButton
                                                icon={
                                                    <MdMarkEmailRead
                                                        size={20}
                                                    />
                                                }
                                                buttonType={
                                                    BUTTON_TYPES.PRIMARY
                                                }
                                                onClick={() =>
                                                    markAsRead(notification.id)
                                                }
                                                outline
                                                className="me-1"
                                            />
                                        )}
                                        <RoundedButton
                                            icon={<FaTrash />}
                                            buttonType={BUTTON_TYPES.DANGER}
                                            onClick={() =>
                                                deleteNotification(
                                                    notification.id
                                                )
                                            }
                                            outline
                                        />
                                    </div>
                                </div>
                            ))}

                            {loading &&
                                Array.from({ length: 5 }).map((_, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between bg-slate-50 p-3 rounded-lg my-1 animate-pulse"
                                    >
                                        <div className="flex items-center">
                                            <div className="w-[50px] h-[50px] rounded-full bg-slate-200"></div>
                                            <div className="ms-1">
                                                <p className="w-32 h-5 bg-slate-200 rounded-md mb-1"></p>
                                                <p className="w-48 h-4 bg-slate-200 rounded-md"></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-slate-200 rounded-full me-1"></div>
                                            <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </DrawerDescription>
                    <DrawerFooter>
                        <Field className="flex items-center justify-end w-full ">
                            <Label className="mx-2 hover:cursor-pointer">
                                {t('mute_notification')}
                            </Label>
                            <Switch
                                checked={mute}
                                onChange={() => setMute(!mute)}
                                className="group inline-flex h-6 w-11 items-center rounded-full focus:ring-brand focus:outline-brand bg-gray-200 transition data-[checked]:bg-brand"
                            >
                                {i18n.dir() == 'ltr' ? (
                                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                                ) : (
                                    <span className="size-4 translate-x-[-24px] rounded-full bg-white transition group-data-[checked]:translate-x-[-4px]" />
                                )}
                            </Switch>
                        </Field>
                    </DrawerFooter>
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    );
};

export default Notification;
