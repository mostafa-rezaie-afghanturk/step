import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import trTranslation from './locales/tr/translation.json';
import faTranslation from './locales/fa/translation.json';
import arTranslation from './locales/ar/translation.json';
import soTranslation from './locales/so/translation.json';
import azTranslation from './locales/az/translation.json';
import esTranslation from './locales/es/translation.json';
import frTranslation from './locales/fr/translation.json';
import kyTranslation from './locales/ky/translation.json';
import ruTranslation from './locales/ru/translation.json';
// Arabic translation

// Define RTL languages
const rtlLanguages = ['ar', 'he', 'fa', 'ur', 'sy']; // Add more if needed

// Function to update the text direction
const setDirection = language => {
    const htmlElement = document.documentElement; // <html> tag

    if (rtlLanguages.includes(language)) {
        htmlElement.setAttribute('dir', 'rtl');
    } else {
        htmlElement.setAttribute('dir', 'ltr');
    }
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: enTranslation },
            tr: { translation: trTranslation },
            fa: { translation: faTranslation },
            fr: { translation: frTranslation }, // French
            es: { translation: esTranslation }, // Spanish
            ar: { translation: arTranslation }, // Arabic
            so: { translation: soTranslation }, // Somali
            az: { translation: azTranslation }, // Azerbaijani
            ky: { translation: kyTranslation }, // Kyrgyz
            ru: { translation: ruTranslation }, // Russian
        },
        // lng: 'en',
        fallbackLng: 'en', // fallback language
        interpolation: {
            escapeValue: false, // React already escapes values
        },
        detection: {
            order: ['localStorage', 'navigator'], // Priority: first look in localStorage, then fallback to navigator language
            caches: ['localStorage'], // Cache the language in localStorage
        },
    });

// Listen for language change and update direction
i18n.on('languageChanged', language => {
    setDirection(language);
});

// Initialize direction on load based on the default language
setDirection(i18n.language);

export default i18n;
