import React from 'react';

const Pagination = ({ totalPages, currentPage, setCurrentPage }) => {
    // const [currentPage, setCurrentPage] = useState(initialPage);

    // Function to handle page click
    const goToPage = page => {
        setCurrentPage(page - 1);
    };

    // Generate pagination numbers
    const getPaginationNumbers = () => {
        let pages = [];

        // Always include first page
        pages.push(1);

        // Add three pages before and after the current page
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i > 1 && i < totalPages) {
                pages.push(i);
            }
        }

        // Always include last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-2 my-0">
            {getPaginationNumbers().map((page, index) => (
                <React.Fragment key={index}>
                    {page == currentPage - 2 && page - 2 > 0 && (
                        <span> ... </span>
                    )}

                    <button
                        onClick={() => goToPage(page)}
                        className={` 
                        ${
                            currentPage + 1 === page
                                ? 'h-7 w-7 px-2 rounded flex items-center justify-center hover:text-brand  font-semibold cursor-pointer transition-all duration-200 text-brand text-sm'
                                : 'h-7 w-7 px-2 rounded bg-white flex items-center justify-center hover:bg-brand hover:text-white cursor-pointer transition-all duration-200'
                        }`}
                    >
                        {page}
                    </button>

                    {page == currentPage + 2 && page + 1 < totalPages && (
                        <span> ... </span>
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export default Pagination;
