<?php

namespace App\Repositories;

use App\Exports\DynamicExport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;
use App\Repositories\BorrowerRepository;
use App\Repositories\ActivityLogRepository;
use App\Repositories\BookRepository;
use App\Repositories\BorrowingRecordRepository;
use App\Repositories\CategoryRepository;
use App\Repositories\ClassRepository;
use App\Repositories\CountryRepository;
use App\Repositories\InventoryRepository;
use App\Repositories\LibraryRepository;
use App\Repositories\SchoolRepository;
use App\Repositories\StudentRepository;
use App\Repositories\UserRepository;

class ExportService
{
    private function applyModelFilters($query, $model)
    {
        $filters = [
            'Borrower' => [BorrowerRepository::class, 'applyBorrowerFilters'],
            'ActivityLog' => [ActivityLogRepository::class, 'applyActivityLogFilters'],
            'Book' => [BookRepository::class, 'applyBookFilters'],
            'BorrowingRecord' => [BorrowingRecordRepository::class, 'applyBorrowingRecordFilters'],
            'Category' => [CategoryRepository::class, 'applyCategoryFilters'],
            'ClassModel' => [ClassRepository::class, 'applyClassFilters'],
            'Country' => [CountryRepository::class, 'applyCountryFilters'],
            'Inventory' => [InventoryRepository::class, 'applyInventoryFilters'],
            'Library' => [LibraryRepository::class, 'applyLibraryFilters'],
            'School' => [SchoolRepository::class, 'applySchoolFilters'],
            'Student' => [StudentRepository::class, 'applyStudentFilters'],
            'User' => [UserRepository::class, 'applyUserFilters'],
            'ParentModel' => [StudentRepository::class, 'applyStudentFilters'],
        ];

        $modelName = class_basename($model);

        if (isset($filters[$modelName])) {
            [$repository, $method] = $filters[$modelName];
            $repositoryInstance = new $repository();
            $query = $repositoryInstance->$method($query);
        }

        return $query;
    }

    public function export(Request $request, $id, $model, $columns, $headings = [])
    {
        ini_set('memory_limit', '2048M'); // Further increase memory limit for very large exports
        // Get the serialized IDs from the query string
        $ids = json_decode($request->query('ids'), true);

        // Start with the base query
        $query = is_object($model) ? $model : $model::query();

        // If IDs are provided, filter the query
        if (! empty($ids)) {
            $query->whereIn($id, $ids);
        }

        // Apply model-specific filters
        $query = $this->applyModelFilters($query, $model);

        // Get selected columns from the request
        $cols = json_decode($request->query('columns'), true);

        // Filter headings and fields based on the selected columns
        $headings = $this->getFilteredHeadings($columns, $cols, $headings);
        $fields = $this->getFilteredFields($columns, $cols);

        // Mapping function: customize the columns dynamically
        $mapCallback = $this->getMapCallback($fields);

        // Return Excel download
        return Excel::download(new DynamicExport($query, $headings, $mapCallback), class_basename($model) . '_dynamic_export.xlsx');
    }

    public function pdf(Request $request, $id, $model, $columns, $title = null)
    {
        ini_set('memory_limit', '2048M'); // Further increase memory limit for very large PDF exports
        // Get the serialized IDs from the query string
        $ids = json_decode($request->query('ids'), true);

        // Start with the base query
        $query = is_object($model) ? $model : $model::query();

        // If IDs are provided, filter the query
        if (! empty($ids)) {
            $query->whereIn($id, $ids);
        }

        // Apply model-specific filters
        $query = $this->applyModelFilters($query, $model);

        // Fetch the data based on the query
        $datas = $query->limit(400)->get();

        // Get selected columns from the request
        $cols = json_decode($request->query('columns'), true);

        // Filter headings and fields based on the selected columns
        $headings = $this->getFilteredHeadings($columns, $cols);
        $fields = $this->getFilteredFields($columns, $cols);

        // Title for the PDF
        $title = $title ?? class_basename($model) . ' Data';

        // Load the PDF view into HTML string
        $html = view('pdf.print', compact('datas', 'headings', 'fields', 'title'))->render();

        // Initialize mPDF
        $mpdf = new Mpdf;

        // Write HTML to the PDF
        $mpdf->WriteHTML($html);

        // Output the PDF as download
        return $mpdf->Output(class_basename($model) . '_export.pdf', 'D');
    }

    private function getFilteredHeadings($columns, $cols, $headings = [])
    {
        return array_values(array_filter(array_map(function ($column) use ($cols) {
            if ($cols == [] || in_array($column['accessor'], $cols)) {
                return $column['header'] ?? null;
            }
        }, $columns)));
    }

    private function getFilteredFields($columns, $cols)
    {
        return array_values(array_filter(array_map(function ($column) use ($cols) {
            if ($cols == [] || in_array($column['accessor'], $cols)) {
                return $column['accessor'];
            }
        }, $columns)));
    }

    private function getMapCallback($fields)
    {
        return function ($row) use ($fields) {
            $array = [];

            foreach ($fields as $field) {
                // Split the field by dot notation for related models
                $fieldParts = explode('.', $field);
                $value = $row;

                foreach ($fieldParts as $part) {
                    if (isset($value->$part)) {
                        $value = $value->$part;
                    } else {
                        $value = null; // If any part is missing, set to null
                        break;
                    }
                }

                array_push($array, $value);
            }

            return $array;
        };
    }
}
