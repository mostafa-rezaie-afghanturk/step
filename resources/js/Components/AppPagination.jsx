import React from 'react';
import { useTranslation } from 'react-i18next';

const AppPagination = ({ paginationData, onPageChange }) => {
    const { t } = useTranslation();
    const { current_page, last_page, per_page, total } = paginationData;

    const handlePageChange = page => {
        if (page >= 1 && page <= last_page) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;
        const halfMaxPageNumbersToShow = Math.floor(maxPageNumbersToShow / 2);

        if (last_page <= maxPageNumbersToShow) {
            for (let i = 1; i <= last_page; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`page-number px-2 py-1 rounded ${current_page === i ? 'bg-brand text-white' : 'text-brand'}`}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            let startPage = Math.max(
                1,
                current_page - halfMaxPageNumbersToShow
            );
            let endPage = Math.min(
                last_page,
                current_page + halfMaxPageNumbersToShow
            );

            if (current_page <= halfMaxPageNumbersToShow) {
                endPage = maxPageNumbersToShow;
            } else if (current_page + halfMaxPageNumbersToShow >= last_page) {
                startPage = last_page - maxPageNumbersToShow + 1;
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(
                    <button
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`page-number px-2 py-1 rounded ${current_page === i ? 'bg-brand text-white' : 'text-brand'}`}
                    >
                        {i}
                    </button>
                );
            }

            if (startPage > 1) {
                pageNumbers.unshift(
                    <button
                        key="start-ellipsis"
                        className="page-number px-2 py-1 rounded text-brand"
                        disabled
                    >
                        ...
                    </button>
                );
            }

            if (endPage < last_page) {
                pageNumbers.push(
                    <button
                        key="end-ellipsis"
                        className="page-number px-2 py-1 rounded text-brand"
                        disabled
                    >
                        ...
                    </button>
                );
            }
        }

        return pageNumbers;
    };

    return (
        <div className="pagination flex flex-col md:flex-row md:items-center justify-between gap-2 mt-4 md:mt-6">
            <div className="flex items-center gap-x-2">
                <button
                    onClick={() => handlePageChange(current_page - 1)}
                    disabled={current_page === 1}
                    className="text-brand disabled:opacity-50"
                >
                    {t('previous')}
                </button>
                {renderPageNumbers()}
                <button
                    onClick={() => handlePageChange(current_page + 1)}
                    disabled={current_page === last_page}
                    className="text-brand disabled:opacity-50"
                >
                    {t('next')}
                </button>
            </div>
            <div className="pagination-info text-gray-500">
                {t('Page')} {current_page} of {last_page}, showing {per_page}{' '}
                group
                {per_page > 1 ? 's' : ''} out of {total} total
            </div>
        </div>
    );
};

export default AppPagination;
