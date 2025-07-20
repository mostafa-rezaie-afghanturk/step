import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for global notification management
const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    // Get the mute value from localStorage (default to false if not set)
    const [mute, setMute] = useState(() => {
        const storedMute = localStorage.getItem('mute');
        return storedMute ? JSON.parse(storedMute) : false;
    });

    const playNotificationSound = async () => {
        if (!mute) {
            const audio = new Audio('/sounds/notification.mp3');

            await audio.play();
        }
    };

    // Save mute value to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('mute', JSON.stringify(mute));
    }, [mute]);

    return (
        <NotificationContext.Provider
            value={{ mute, setMute, playNotificationSound }}
        >
            {children}
        </NotificationContext.Provider>
    );
};
