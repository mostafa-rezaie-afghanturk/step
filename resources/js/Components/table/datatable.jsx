import React, { useEffect, useState } from 'react';
import { useTable, useSortBy, usePagination } from 'react-table';
import FilterPopover from './filterpopover';
import Pagination from './pagination';
import ColumnVisibilityPopover from './column_visibility_popover';
import Actions from './actions';
import { DatatableContext } from './datatableContext';
import PopupMessage from '../ui/popupMessage';
import Export from './export';
import Checkbox from '../ui/form/Checkbox';
import { useTranslation } from 'react-i18next';
import { Field, Label, Switch } from '@headlessui/react';
import Import from './import';
import { usePermission } from '@/hooks/usePermission';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

const DataTable = ({
    columns,
    primaryKey,
    url,
    editUrl = '',
    deleteUrl = '',
    exportUrl = '',
    importUrl = '',
    importFormatUrl = '',
    pdfUrl = '',
    duplicateUrl = '',
    refreshDatatable = false,
    setRefreshDatatable = data => { },
    hideActions = false,
    hideExport = false,
    h,
    placeholderLength = 14,
    tab = 'all',
    setOpenSingleModal = null,
    setSelectedId = data => { },
    classTd = '',
    permissionModule = '',
    hideFilter = true,
    hideColumn = true,
    fakeId = null,

}) => {
    const { hasPermission } = usePermission();
    const { t, i18n } = useTranslation();
    const [data, setData] = useState([]);
    const [meta, setMeta] = useState([]);
    const [filter, setFilter] = useState([]);
    const [search, setSearch] = useState('');
    const [isSearch, setIsSearch] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [visibleColumns, setVisibleColumns] = useState(
        columns.filter(col => col.visible).map(col => col)
    );
    const [debounceTimeout, setDebounceTimeout] = useState(null);
    const [exactMatch, setExactMatch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);


    const [expandedRows, setExpandedRows] = useState({});

    // A function to toggle expanded state for a rowId
    const toggleExpanded = (rowId) => {
        setExpandedRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId],
        }));
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setPageSize,
        gotoPage,
        state: { pageIndex, pageSize, sortBy },
    } = useTable(
        {
            columns: visibleColumns,
            data,
            manualPagination: true, // Server-side pagination
            manualSortBy: true, // Server-side sorting
            pageCount: meta.last_page, // Total number of pages from the server
            initialState: {
                pageIndex: meta.current_page - 1,
                pageSize: meta.per_page,
            },
        },

        useSortBy,
        usePagination
    );

    const GotoPage = page => {
        setCurrentPage(page);
        gotoPage(page);
    };

    // Handle row selection by dynamic primary key (e.g., school_id, book_id)
    const toggleRowSelected = rowId => {
        setSelectedRows(prevSelected => ({
            ...prevSelected,
            [rowId]: !prevSelected[rowId],
        }));
    };

    // Handle select all / deselect all based on current selection
    const handleSelectAll = () => {
        const allRowIds = rows.map(row => row.original[primaryKey]);

        // Check if all rows are currently selected
        const allSelected = rows.every(
            row => selectedRows[row.original[primaryKey]]
        );

        // If all rows are selected, deselect all; otherwise, select all
        const updatedSelectedRows = allSelected
            ? {} // Deselect all rows
            : allRowIds.reduce((acc, rowId) => {
                acc[rowId] = true;
                return acc;
            }, {});

        setSelectedRows(updatedSelectedRows);
    };

    const Refresh = () => {

        // Fetch data from server only when pagination or sorting changes
        setIsLoading(true);
        const sortColumn = sortBy[0] ? sortBy[0].id : columns[0].accessor;
        const sortDirection = sortBy[0]
            ? sortBy[0].desc
                ? 'desc'
                : 'asc'
            : 'desc';
        //   axios
        // fetch()

        const url_parameters = new URLSearchParams({
            page: (currentPage ? currentPage : 0) + 1,
            page_size: pageSize ? pageSize : 10,
            sort_column: sortColumn,
            sort_direction: sortDirection,
            filters: JSON.stringify(filter),
            search: search,
            exact_match: exactMatch,
            tab: tab,
        }).toString();

        fetch(url + '?' + url_parameters)
            .then(response => response.json()) // one extra step
            .then(data => {
                setData(data.records);
                setMeta(data.meta);

                if (data?.meta?.last_page <= currentPage) {
                    setCurrentPage(0);
                }
                const expandedIds = getAllExpandedRowIds(data.records);
                const expandedObj = Object.fromEntries(expandedIds.map(id => [id, true]));
                setExpandedRows(expandedObj); // ✅ now this will include all nested rows
                setExpandedRows(expandedObj);
            })
            .catch(error => console.error(error))
            .finally(() => setIsLoading(false));
    };

    useEffect(() => {
        Refresh();
    }, [pageIndex, pageSize, sortBy, currentPage, filter, tab]);

    useEffect(() => {
        if (isSearch) {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }

            const timeout = setTimeout(() => {
                Refresh();
            }, 500);
            setDebounceTimeout(timeout);

            return () => clearTimeout(timeout);
        }
    }, [search, exactMatch]);

    useEffect(() => {
        if (refreshDatatable) {
            Refresh();
            setRefreshDatatable(false);
        }
    }, [refreshDatatable]);
    const totalSelected = Object.keys(selectedRows).filter(
        key => selectedRows[key]
    ).length;
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        setVisibleColumns(
            columns
                .filter(col => col.visible)
                .map(col => ({
                    ...col,
                }))
        );
    }, [columns]);

    const openModal = rowId => {
        setSelectedId(rowId);
        setOpenSingleModal(true);
    };
    const getNestedValue = (obj, path) => {
        return path
            .split('.')
            .reduce((o, key) => (o ? o[key] : undefined), obj);
    };


    function RenderNestedRows({
        rows,
        columns,
        primaryKey,
        hideActions,
        expandedRows,
        toggleExpanded,
        classTd = '',
        openModal,
        fakeId,
        level = 0,
    }) {
        return (
            <table className="min-w-full border-collapse table-auto text-left border rounded">
                <thead className=" invisible h-0 overflow-hidden">
                    <tr>
                        {!hideActions && <th className="px-3 p-1 w-[2rem]"></th>}
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                className="px-3 p-1 font-semibold text-gray-700 whitespace-nowrap"
                            >
                                {col.Header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => {
                        const rowId = row[primaryKey];
                        const isExpanded = expandedRows[rowId];
                        const hasChildren = row.children && row.children.length > 0;

                        return (
                            <React.Fragment key={rowId}>
                                <tr className="hover:bg-gray-100 cursor-pointer">
                                    {!hideActions && (
                                        <td className="px-3 p-1 text-gray-600 w-[2rem]">
                                            <div className='h-4 w-4'>

                                            </div>
                                        </td>
                                    )}

                                    {columns.map((col, colIndex) => {



                                        return <td

                                            key={colIndex}
                                            style={{ width: col.width || 'auto' }}
                                            className={`px-3 p-1 text-gray-600 whitespace-nowrap  ${classTd}`}
                                            onClick={() =>
                                                colIndex === 0 && openModal
                                                    ? openModal(rowId)
                                                    : undefined
                                            }
                                        >
                                            <span className={`${colIndex === 0 ? `pl-${level * 6}` : ''}`}>
                                                {col.Cell
                                                    ? col.Cell({ row })
                                                    : colIndex === 0 && fakeId
                                                        ? `${index + 1}-${row[fakeId] ?? ''}`
                                                        : row[col.accessor] ?? ''}
                                            </span>

                                            {colIndex === 0 && hasChildren && (
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleExpanded(rowId);
                                                    }}
                                                    className="cursor-pointer text-lg mr-2 select-none float-start"
                                                >
                                                    {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                                                </span>
                                            )}


                                        </td>
                                    })}
                                </tr>

                                {hasChildren && isExpanded && (
                                    <tr>
                                        <td colSpan={columns.length + (!hideActions ? 1 : 0)} className="bg-gray-50">
                                            {/* Recursive call for sub-children */}
                                            <RenderNestedRows
                                                rows={row.children}
                                                columns={visibleColumns}
                                                primaryKey={primaryKey}
                                                hideActions={hideActions}
                                                expandedRows={expandedRows}
                                                toggleExpanded={toggleExpanded}
                                                classTd={classTd}
                                                openModal={openModal}
                                                fakeId={fakeId}
                                                level={level + 1}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        );
    }
    function getAllExpandedRowIds(rows, primaryKey = 'category_id') {
        let ids = [];

        for (const row of rows) {
            if (row[primaryKey]) {
                ids.push(row[primaryKey]);
            }

            if (Array.isArray(row.children) && row.children.length > 0) {
                ids = ids.concat(getAllExpandedRowIds(row.children, primaryKey));
            }
        }

        return ids;
    }


    return (
        <>
            {showPopup?.visible && (
                <PopupMessage
                    type={showPopup.type}
                    message={showPopup.message}
                    duration={3000}
                    onClose={() => setShowPopup(false)}
                />
            )}

            <DatatableContext.Provider
                value={{
                    setSelectedRows,
                    selectedRows,
                    columns,
                    setVisibleColumns,
                    visibleColumns,
                    setFilter,
                    editUrl,
                    Refresh,
                    setShowPopup,
                    deleteUrl,
                    exportUrl,
                    importUrl,
                    importFormatUrl,
                    pdfUrl,
                    duplicateUrl,
                }}
            >
                <div className="border rounded-t-lg px-2 py-3 border-b-0 flex flex-col sm:flex-row justify-between">
                    <div className="relative  mx-1 flex items-center">
                        <input
                            type="text"
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                                setIsSearch(true);
                            }}
                            placeholder={t('search') + '...'}
                            className=" border w-64 border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-brand"
                        />

                        <Field className="flex items-center w-full ">
                            <Label className="mx-2 hover:cursor-pointer">
                                {t('exact_match')}
                            </Label>
                            <Switch
                                checked={exactMatch}
                                onChange={setExactMatch}
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

                    <div className="flex flex-wrap">
                        {!hideActions && (
                            <Actions permissionModule={permissionModule} />
                        )}
                        {hasPermission(`${permissionModule} read`) && (
                            <>
                                {hideColumn && <ColumnVisibilityPopover />}

                                {hideFilter && (
                                    <FilterPopover
                                        permissionModule={permissionModule}
                                    />
                                )}
                            </>
                        )}

                        {!hideExport &&
                            hasPermission(`${permissionModule} export`) && (
                                <Export permissionModule={permissionModule} />
                            )}
                        {importUrl &&
                            hasPermission(`${permissionModule} import`) && (
                                <Import permissionModule={permissionModule} />
                            )}
                    </div>
                </div>

                <div
                    className={`border  pb-2 rounded-b-lg overflow-auto ${h ? h : ` md:h-[70dvh] sm:h-[50dvh]`}`}
                >

                    <table
                        {...getTableProps()}
                        className="min-w-full border-collapse  table-auto text-left"
                    >
                        <thead className="bg-neutral-100 z-[1] sticky top-0 ">
                            {headerGroups.map((headerGroup, index) => (
                                <tr
                                    {...headerGroup.getHeaderGroupProps()}
                                    key={index}
                                >
                                    {!hideActions && (
                                        <th className="px-3 p-1 text-gray-700 font-semibold w-[2rem]">
                                            <Checkbox
                                                onChange={handleSelectAll}
                                                checked={rows.every(
                                                    row =>
                                                        selectedRows[
                                                        row.original[
                                                        primaryKey
                                                        ]
                                                        ]
                                                )}
                                            />
                                        </th>
                                    )}

                                    {headerGroup.headers.map(
                                        (column, columnIndex) => (
                                            <th
                                                {...column.getHeaderProps(
                                                    column.getSortByToggleProps()
                                                )}
                                                className="px-3 p-1 text-gray-700 font-semibold text-start whitespace-nowrap"
                                                key={columnIndex}
                                            >
                                                {t(column.render('Header'))}
                                                <span>
                                                    {column.isSorted
                                                        ? column.isSortedDesc
                                                            ? ' 🔽'
                                                            : ' 🔼'
                                                        : ''}
                                                </span>
                                            </th>
                                        )
                                    )}
                                </tr>
                            ))}
                        </thead>

                        <tbody {...getTableBodyProps()} className="divide-y divide-gray-100">
                            {isLoading
                                ? Array.from({ length: placeholderLength }).map((_, index) => (
                                    <tr key={index} className="animate-pulse h-10">
                                        <td className="px-3 p-1">
                                            <div className="h-5 w-5 bg-gray-200 rounded"></div>
                                        </td>
                                        {columns.map((_, cellIndex) => (
                                            <td key={cellIndex} className="px-3 p-1">
                                                <div className="h-5 bg-gray-200 rounded"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                                : rows.map((row, index) => {
                                    prepareRow(row);
                                    const rowId = row.original[primaryKey];
                                    const isSelected = !!selectedRows[rowId];
                                    const isExpanded = expandedRows[rowId];
                                    const hasChildren = row.original.children && row.original.children.length > 0;

                                    return (
                                        <React.Fragment key={rowId}>
                                            <tr {...row.getRowProps()} className="hover:bg-gray-100">
                                                {!hideActions && (
                                                    <td className="px-3 p-1 text-gray-600 w-[2rem]">
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onChange={() => toggleRowSelected(rowId)}
                                                        />
                                                    </td>
                                                )}

                                                {row.cells.map((cell, cellIndex) => (
                                                    <td
                                                        {...cell.getCellProps()}
                                                        className={`px-3 p-1 text-gray-600 text-start whitespace-nowrap ${cellIndex === 0 && typeof setOpenSingleModal === 'function'
                                                            ? 'hover:cursor-pointer !text-brand hover:underline'
                                                            : ''
                                                            } ${classTd}`}
                                                        onClick={() =>
                                                            cellIndex === 0 && openModal ? openModal(rowId) : undefined
                                                        }
                                                    >
                                                        {cellIndex === 0 && hasChildren && (
                                                            <span
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    toggleExpanded(rowId);
                                                                }}
                                                                className="cursor-pointer text-lg mr-2 select-none float-start"
                                                            >
                                                                {isExpanded ? <MdExpandLess /> : <MdExpandMore />}
                                                            </span>
                                                        )}
                                                        {cellIndex === 0 && fakeId
                                                            ? `${index + 1}-${getNestedValue(row.original, fakeId) ?? ''}`
                                                            : cell.render('Cell')}
                                                    </td>
                                                ))}
                                            </tr>

                                            {hasChildren && isExpanded && (
                                                <tr>
                                                    <td colSpan={row.cells.length + (!hideActions ? 1 : 0)} className="bg-gray-50">
                                                        <RenderNestedRows
                                                            rows={row.original.children}
                                                            columns={visibleColumns}
                                                            primaryKey={primaryKey}
                                                            hideActions={hideActions}
                                                            expandedRows={expandedRows}
                                                            toggleExpanded={toggleExpanded}
                                                            classTd={classTd}
                                                            openModal={openModal}
                                                            fakeId={fakeId}
                                                            level={1}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>

                <div className="border-t">
                    <div className="flex justify-between items-center flex-wrap">
                        <div className="flex items-center">
                            <button
                                className="p-2 mr-4 rounded hover:underline disabled:cursor-not-allowed disabled:text-gray-400"
                                onClick={() => GotoPage(meta.current_page - 2)}
                                disabled={!meta.has_previous_page}
                            >
                                {t('previous')}
                            </button>
                            <Pagination
                                totalPages={meta.last_page}
                                currentPage={currentPage}
                                setCurrentPage={GotoPage}
                            />

                            <button
                                className="p-2  rounded ml-2 hover:underline  disabled:cursor-not-allowed disabled:text-gray-400"
                                onClick={() => GotoPage(meta.current_page)}
                                disabled={!meta.has_next_page}
                            >
                                {t('next')}
                            </button>
                        </div>
                        <div className="text-gray-600">
                            {totalSelected > 0 && (
                                <div>
                                    <strong>{totalSelected} </strong>items
                                    selected
                                </div>
                            )}
                        </div>
                        <div className="mx-2 text-gray-600">
                            {t('Showing')} <strong>{meta.from ?? 0}</strong>{' '}
                            {t('to')} <strong>{meta.to ?? 0}</strong> {t('of')}{' '}
                            <strong>{meta.total ?? 0}</strong> {t('results')}
                        </div>
                        <select
                            className="px-2 py-0 border-gray-300 rounded bg-none me-2"
                            value={pageSize}
                            onChange={e => setPageSize(Number(e.target.value))}
                        >
                            {[10, 30, 50, 100, 200, 500].map(size => (
                                <option key={size} value={size}>
                                    {t('show')} {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </DatatableContext.Provider>
        </>
    );
};

export default DataTable;

