import React, { useEffect, useState } from 'react';
import Header from '../Components/Portal/Header';
import { usePage } from '@inertiajs/react';
import { onError, onSuccess } from '@/lib/appAlert';
import { useTranslation } from 'react-i18next';
import useRealTimeNotifications from '@/hooks/useRealTimeNotifications';

const AppLayout = ({ children }) => {
    // useRealTimeNotifications();
    const { totalBooksRead, flash } = usePage().props;
    const [fontClass, setFontClass] = useState('font-poppins');
    const { i18n } = useTranslation();

    useEffect(() => {
        if (flash?.success || flash?.message || flash?.error) {
            if (flash?.success || flash?.message) {
                onSuccess(flash?.success || flash?.message);
            } else if (flash?.error) {
                onError(flash?.error);
            }
        }
    }, [flash.message || flash.success || flash.error]);

    useEffect(() => {
        switch (i18n.language) {
            case 'fa':
                setFontClass('font-iran-sans');
                break;
            default:
                setFontClass('font-poppins');
                break;
        }
    }, [i18n.language]);

    return (
        <div className={`${fontClass}`}>
            <Header totalBooksRead={totalBooksRead} />
            <div>
                <main>{children}</main>
            </div>
        </div>
    );
};

export default AppLayout;
