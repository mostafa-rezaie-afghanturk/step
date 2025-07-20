import React, { useEffect, useRef, useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
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
import { usePage } from '@inertiajs/react';

const Notification = () => {
    const user = usePage().props.auth.user;

    const { mute, setMute } = useNotification();
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
                route('notifications.portal.index'),
                {
                    params: { page },
                }
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
            const data = await HTTPClient.post(
                route('notifications.portal.read'),
                {
                    id: id,
                }
            );
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
                route('notifications.portal.destroy', {
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

    return (
        <Popover className="relative">
            <PopoverButton
                className="py-1 px-2 hover:bg-gray-100 focus:outline-none rounded-md inline-flex items-center gap-x-2"
                onClick={() => setOpen(!open)}
            >
                <div className="relative">
                    <FiBell
                        className="text-gray-600 hover:text-gray-800"
                        size={20}
                    />
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
                </div>
            </PopoverButton>
            <PopoverPanel
                className={`absolute ${
                    i18n.dir() === 'rtl' ? 'left-0' : 'right-0'
                } mt-2 w-[90vw] sm:w-96 md:w-[450px] bg-white rounded-md shadow-lg z-10 origin-top flex-col transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0`}
            >
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">
                            {t('Notifications')}
                        </h3>
                        <div className="flex gap-2">
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
                    </div>
                    <div
                        ref={containerRef}
                        className="h-64 sm:h-96 overflow-y-auto" // Responsive height
                    >
                        {notifications.map((notification, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between gap-x-1 py-3 px-1 rounded-lg my-1 ${
                                    notification.read_at
                                        ? 'bg-slate-50'
                                        : 'bg-slate-200'
                                }`}
                            >
                                {/* <div className="flex items-center">
                                    <div className="w-[50px] h-[50px] rounded-full flex justify-center items-center text-2xl bg-slate-200 overflow-hidden">
                                        N
                                    </div>
                                </div> */}
                                <div className="ms-1">
                                    <p className="font-medium">
                                        {notification.title}
                                    </p>
                                    <p className="text-sm">
                                        {notification.description}
                                    </p>
                                </div>
                                <div className="flex items-center">
                                    {notification.read_at == null && (
                                        <RoundedButton
                                            icon={<MdMarkEmailRead size={20} />}
                                            buttonType={BUTTON_TYPES.PRIMARY}
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
                                            deleteNotification(notification.id)
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
                    <Field className="flex items-center justify-end w-full mt-4">
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
                </div>
            </PopoverPanel>
        </Popover>
    );
};

export default Notification;
