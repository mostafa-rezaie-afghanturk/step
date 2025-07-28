import './bootstrap';
import '../css/app.css';
import 'react-perfect-scrollbar/dist/css/styles.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../public/i18n/i18n';
import { NotificationProvider } from './context/NotificationContext';
import { TourProvider } from './context/TourProvider';

const appName = import.meta.env.VITE_APP_NAME || 'E-Library';

createInertiaApp({
    title: title => (title ? `${title} - ${appName}` : appName),
    resolve: name =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx')
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <NotificationProvider>
                <I18nextProvider i18n={i18n}>
                    {/* <TourProvider> */}
                        <App {...props} />
                    {/* </TourProvider> */}
                </I18nextProvider>
            </NotificationProvider>
        );
    },
    progress: {
        color: '#00ADBB',
    },
});
