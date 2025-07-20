import { useEffect } from 'react';
import { useNotification } from '@/context/NotificationContext';
import { usePage } from '@inertiajs/react';
// import { echoInstance } from '@/echo';

const useRealTimeNotifications = () => {
    const { mute, playNotificationSound } = useNotification();
    const user = usePage().props.auth.user;
};

export default useRealTimeNotifications;
