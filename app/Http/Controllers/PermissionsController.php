<?php

namespace App\Http\Controllers;

use App\Exports\DynamicExport;
use App\Helpers\DataValidationHelper;
use App\Http\Requests\Permissions\StorePermissionRequest;
use App\Http\Requests\Permissions\UpdatePermissionRequest;
use App\Repositories\FilterRepository;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Mpdf\Mpdf;
use Spatie\Permission\Models\Permission;

class PermissionsController extends Controller
{
    private $columns;

    protected $filterRepository;

    public $searchColumns = ['name', 'module'];

    public function __construct(FilterRepository $filterRepository)
    {
        $this->filterRepository = $filterRepository;
        $this->columns = [
            [
                'header' => 'name',
                'accessor' => 'name',
                'visibility' => true,
                'type' => 'string',
            ],
            [
                'header' => 'module',
                'accessor' => 'module',
                'visibility' => true,
                'type' => 'string',
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('Permissions/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function datatable(Request $request)
    {
        $query = Permission::query();
        $data = $this->filterRepository->applyFilters($query, $request, $this->searchColumns);

        // Send the data and meta information
        return response()->json([
            'records' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
                'total' => $data->total(),
                'has_previous_page' => $data->currentPage() > 1,
                'has_next_page' => $data->currentPage() < $data->lastPage(),
            ],
        ]);
    }

    public function create($id = null)
    {
        $permission = null;
        if ($id) {
            $permission = Permission::find($id);
        }

        $fields = [
            [
                'label' => 'Name',
                'name' => 'name',
                'type' => 'string',
                'required' => true,
                'default' => $permission?->name,
            ],
            [
                'label' => 'Module',
                'name' => 'module',
                'type' => 'select',
                'option' => Permission::distinct()->pluck('module')->toArray(),
                'required' => true,
                'default' => $permission?->module,
            ],
        ];

        return Inertia::render('Permissions/Create', [
            'fields' => $fields,
            'permission' => $permission,
        ]);
    }

    public function store(StorePermissionRequest $request)
    {
        Permission::create([
            'name' => $request->name,
            'module' => $request->module,
        ]);

        return redirect()->route('permissions.index');
    }

    public function edit($id)
    {
        $permission = Permission::findOrFail($id);

        $fields = [
            [
                'label' => 'Name',
                'name' => 'name',
                'type' => 'string',
                'required' => true,
                'default' => $permission->name,
            ],
            [
                'label' => 'Module',
                'name' => 'module',
                'type' => 'select',
                'option' => Permission::distinct()->pluck('module')->toArray(),
                'required' => true,
                'default' => $permission->module,
            ],
        ];

        return Inertia::render('Permissions/Edit', [
            'fields' => $fields,
            'permission' => $permission,
        ]);
    }

    public function update(UpdatePermissionRequest $request, $id)
    {
        $permission = Permission::findOrFail($id);
        $permission->update([
            'name' => $request->name,
            'module' => $request->module,
        ]);

        return to_route('permissions.index');
    }

    public function destroy($id)
    {
        $permission = Permission::findOrFail($id);
        $permission->delete();

        return to_route('permissions.index');
    }

    public function bulkEdit(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'ids' => 'required|array',
            'field' => 'required|string',
            'value' => 'required',
        ]);

        // Get the model and the table name
        $model = new Permission;
        $table = $model->getTable();

        // Check if the field is fillable
        if (! in_array($validated['field'], $model->getFillable())) {
            return response()->json([
                'message' => "The selected field '{$validated['field']}' cannot be updated. Allowed fields are: ".implode(', ', $model->getFillable()),
            ], 400);
        }

        // Check if the field exists in the database
        if (! Schema::hasColumn($table, $validated['field'])) {
            return response()->json([
                'message' => "The selected field '{$validated['field']}' does not exist in the '{$table}' table.",
            ], 400);
        }

        // Get the field type
        $columnType = Schema::getColumnType($table, $validated['field']);

        // Perform a check based on the column type
        $isValid = DataValidationHelper::isValidValueForColumn($columnType, $validated['value'], $table, $validated['field']);
        if ($isValid !== true) {
            // If not valid, provide an error message based on the column type
            $errorMessage = "The value '{$validated['value']}' is not valid for the field '{$validated['field']}'.";

            // If the column type is an enum, mention that the value should be one of the allowed enum values
            if ($columnType === 'enum') {
                $enumValues = DataValidationHelper::isValidEnumValue($table, $validated['field'], $validated['value']);
                $errorMessage .= ' Please use one of the valid enum values: '.implode(', ', $enumValues).'.';
            }

            return response()->json(['message' => $errorMessage], 400);
        }

        // Perform the bulk update
        $updatedCount = Permission::whereIn('school_id', $validated['ids'])->update([
            $validated['field'] => $validated['value'],
        ]);

        if ($updatedCount === 0) {
            return response()->json(['message' => 'No matching records found to update for the provided IDs.'], 404);
        }

        // Return a successful response
        return response()->json(['message' => 'Records updated successfully.', 'updated_count' => $updatedCount]);
    }

    public function bulkDelete(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'ids' => 'required|array', // IDs are required and should be an array
        ]);

        try {
            // Perform the bulk delete
            $deletedCount = Permission::whereIn('id', $validated['ids'])->delete();

            if ($deletedCount === 0) {
                return response()->json(['message' => 'No matching records found to delete for the provided IDs.'], 404);
            }

            // Return a successful response
            return response()->json(['message' => 'Records deleted successfully.', 'deleted_count' => $deletedCount]);
        } catch (QueryException $e) {
            // Check if the exception is due to foreign key constraint
            if ($e->getCode() == '23000') { // 23000 is the SQLSTATE code for foreign key violation
                return response()->json([
                    'message' => 'Cannot delete some records because they have related child records in other tables.',
                ], 400);
            }

            // Handle any other database-related exceptions
            return response()->json(['message' => 'An error occurred while deleting records.'], 400);
        }
    }

    public function export(Request $request)
    {
        // Get the serialized IDs from the query string
        $ids = json_decode($request->query('ids'), true); // Convert to an array

        // Example: Start with the base query
        $query = Permission::query();

        // If IDs are provided, filter the query
        if (! empty($ids)) {
            $query->whereIn('id', $ids);
        }
        $cols = json_decode($request->query('columns'), true); // Convert to an array

        // Get existing headings from $this->columns
        $headings = array_map(function ($column) use ($cols) {
            // Check if the header is in $cols
            if ($cols == []) {
                return $column['header'];
            }
            if (in_array($column['accessor'], $cols)) {
                return $column['header']; // Add header if it exists in $cols
            }
            // Return null if it doesn't exist
        }, $this->columns); // Assuming $this->columns is defined in your controller
        // Filter out null values and reindex the array
        $headings = array_values(array_filter($headings, function ($value) {
            return ! is_null($value); // Remove null values
        }));
        // Generate fields
        $fields = array_map(function ($column) use ($cols) {
            if ($cols == []) {
                return $column['accessor'];
            }
            if (in_array($column['accessor'], $cols)) {
                return $column['accessor'];
            }
            // return null;
        }, $this->columns);

        $fields = array_values(array_filter($fields, function ($value) {
            return ! is_null($value); // Remove null values
        }));

        // Mapping function: customize the columns dynamically
        $mapCallback = function ($row) use ($fields) {
            $array = [];

            foreach ($fields as $field) {
                // Split the field by dot notation for related models
                $fieldParts = explode('.', $field);
                $value = $row;

                // Traverse through each part of the field to get the nested value
                foreach ($fieldParts as $part) {
                    // Make sure the value exists before accessing deeper
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

        // Download the file with the dynamic export
        return Excel::download(new DynamicExport($query, $headings, $mapCallback), 'dynamic_export.xlsx');
    }

    public function pdf(Request $request)
    {

        // Get the serialized IDs from the query string
        $ids = json_decode($request->query('ids'), true); // Convert to an array

        // Example: Start with the base query
        $query = Permission::query();

        // If IDs are provided, filter the query
        if (! empty($ids)) {
            $query->whereIn('id', $ids);
        }

        // Fetch the schools based on the query
        $datas = $query->get();

        // Dynamic headings for the PDF
        $cols = json_decode($request->query('columns'), true); // Convert to an array

        // Get existing headings from $this->columns
        $headings = array_map(function ($column) use ($cols) {
            // Check if the header is in $cols
            if ($cols == []) {
                return $column['header'];
            }
            if (in_array($column['accessor'], $cols)) {
                return $column['header']; // Add header if it exists in $cols
            }
            // Return null if it doesn't exist
        }, $this->columns); // Assuming $this->columns is defined in your controller
        // Filter out null values and reindex the array
        $headings = array_values(array_filter($headings, function ($value) {
            return ! is_null($value); // Remove null values
        }));
        // Generate fields
        $fields = array_map(function ($column) use ($cols) {
            if ($cols == []) {
                return $column['accessor'];
            }
            if (in_array($column['accessor'], $cols)) {
                return $column['accessor'];
            }
            // return null;
        }, $this->columns);

        $fields = array_values(array_filter($fields, function ($value) {
            return ! is_null($value); // Remove null values
        }));
        $title = 'Permissions Page';
        // Load the PDF view into HTML string
        $html = view('pdf.print', compact('datas', 'headings', 'fields', 'title'))->render();

        // Initialize mPDF
        $mpdf = new Mpdf;

        // Write HTML to the PDF
        $mpdf->WriteHTML($html);

        // Output the PDF as download
        $mpdf->Output('permissions_export.pdf', 'D');
    }
}
