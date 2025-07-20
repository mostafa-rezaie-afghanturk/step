import React from 'react';
import { useTranslation } from 'react-i18next';

const EmptyState = () => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-col items-center justify-center h-full text-center w-full">
            <img
                src="/assets/illustrations/empty.svg"
                alt=""
                className="max-w-16 mb-2"
            />
            <h2 className="font-medium text-gray-700">
                {t('No content available')}
            </h2>
            <p className="text-gray-500 text-xs sm:text-sm">
                {t('There is no content available to display')}
            </p>
        </div>
    );
};

export default EmptyState;
