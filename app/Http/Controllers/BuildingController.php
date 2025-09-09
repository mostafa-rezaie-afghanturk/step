<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\Floor;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\ExportService;
use App\Repositories\ActivityLogRepository;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use App\Traits\HasFileUploads;

class BuildingController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns, HasFileUploads;

    protected $activityLogRepository;
    protected $filterRepository;
    protected $exportService;

    private $columns;
    private $fields;

    public $searchColumns = ['building_code', 'name', 'construction_date', 'tmv_start_date', 'floor_count', 'ownership_status'];

    public function __construct(
        ExportService $exportService,
        ActivityLogRepository $activityLogRepository,
        FilterRepository $filterRepository
    ) {
        $this->columns = $this->getColumns();
        $this->exportService = $exportService;
        $this->activityLogRepository = $activityLogRepository;
        $this->filterRepository = $filterRepository;
    }

    protected function getColumns()
    {
        return [
            [
                'header' => 'building_code',
                'accessor' => 'building_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:buildings,building_code',
                'context' => ['show', 'create'],
            ],
            [
                'header' => 'name',
                'accessor' => 'name',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'construction_date',
                'accessor' => 'construction_date',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'tmv_start_date',
                'accessor' => 'tmv_start_date',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'floor_count',
                'accessor' => 'floor_count',
                'visibility' => true,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'ownership_status',
                'accessor' => 'ownership_status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['TMV', 'Rent'],
                'validation' => 'required|string|in:TMV,Rent',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'purchase_price',
                'accessor' => 'purchase_price',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required_if:ownership_status,TMV|nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,TMV',
            ],
            [
                'header' => 'purchase_date',
                'accessor' => 'purchase_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required_if:ownership_status,TMV|nullable|date',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,TMV',
            ],

            [
                'header' => 'rental_fee',
                'accessor' => 'rental_fee',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required_if:ownership_status,Rent|nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,Rent',
            ],
            [
                'header' => 'lease_start',
                'accessor' => 'lease_start',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required_if:ownership_status,Rent|nullable|date',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,Rent',
            ],
            [
                'header' => 'lease_end',
                'accessor' => 'lease_end',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required_if:ownership_status,Rent|nullable|date',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,Rent',
            ],

            [
                'header' => 'land',
                'accessor' => 'land_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|integer|exists:lands,land_id',
                'search_url' => route('lands.search'),
                'context' => ['edit', 'create'],
            ],
            [
                'header' => 'allocation_docs',
                'accessor' => 'allocation_docs',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
            [
                'header' => 'purchase_docs',
                'accessor' => 'purchase_docs',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'required_if:ownership_status,TMV|nullable',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,TMV',
                'width' => 2,
            ],
            [
                'header' => 'lease_docs',
                'accessor' => 'lease_docs',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'required_if:ownership_status,Rent|nullable',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'ownership_status,Rent',
                'width' => 2,
            ],
            [
                'header' => 'building_project',
                'accessor' => 'building_project',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('Buildings/Index', [
            'columns' => $this->columns
        ]);
    }

    public function search($search = null)
    {
        return $this->handleDependentSearch(
            Building::class,
            $search,
            null,
            null,
            null,
            'name',
            'building_id',
            function ($building) {
                return $building->building_code . ' ' . $building->name;
            },
            null
        );
    }

    public function create($id = null)
    {
        $building = $id ? Building::findOrFail($id) : null;

        $editableColumns = array_filter($this->getColumns(), fn($col) => in_array('create', $col['context']));

        $fields = array_map(function ($column) use ($building) {
            return [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'default' => $building ? data_get($building, $column['accessor']) : null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
                'required_if' => $column['required_if'] ?? null,
                'width' => $column['width'] ?? 1,
            ];
        }, $editableColumns);

        return Inertia::render('Buildings/Create', [
            'fields' => $fields,
            'Building' => $building,
        ]);
    }

    public function show(string $id)
    {
        $data = Building::with(['land', 'allocationDocs', 'purchaseDocs', 'leaseDocs'])->where('building_id', $id)->first();

        return response()->json(['record' => $data]);
    }

    public function store(Request $request)
    {
        $rules = [];

        foreach ($this->columns as $col) {
            if (in_array('create', $col['context'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);

        $building = Building::create([
            'building_code' => $data['building_code'],
            'name' => $data['name'],
            'construction_date' => $data['construction_date'],
            'tmv_start_date' => $data['tmv_start_date'],
            'floor_count' => $data['floor_count'],
            'ownership_status' => $data['ownership_status'],
            'purchase_price' => $data['purchase_price'],
            'purchase_date' => $data['purchase_date'],
            'rental_fee' => $data['rental_fee'],
            'lease_start' => $data['lease_start'],
            'lease_end' => $data['lease_end'],
            'land_id' => $data['land_id'],
        ]);

        $building->handleFileUploads($request);

        return redirect()->route('buildings.index')->with('success', 'Building created successfully.');
    }

    public function edit($id)
    {
        $building = Building::with(['land', 'allocationDocs', 'purchaseDocs', 'leaseDocs'])->findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $fields = array_map(function ($column) use ($building) {
            $default = $building ? ($building[$column['accessor']] ?? null) : null;

            // Handle file fields to provide URLs from relationships
            if ($building) {
                switch ($column['accessor']) {
                    case 'purchase_docs':
                        $default = $building->purchaseDocs ? $building->purchaseDocs->map(function ($file) {
                            return url('storage/' . $file->file_path);
                        })->toArray() : [];
                        break;
                    case 'lease_docs':
                        $default = $building->leaseDocs ? $building->leaseDocs->map(function ($file) {
                            return url('storage/' . $file->file_path);
                        })->toArray() : [];
                        break;
                    case 'allocation_docs':
                        $default = $building->allocationDocs ? $building->allocationDocs->map(function ($file) {
                            return url('storage/' . $file->file_path);
                        })->toArray() : [];
                        break;
                }
            }

            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $default,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
                'required_if' => $column['required_if'] ?? null,
            ];

            return $field;
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('Buildings/Edit', [
            'fields' => $fields,
            'building' => $building,
        ]);
    }

    public function update(Request $request, $id)
    {
        $building = Building::findOrFail($id);

        $rules = [];

        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context']) && isset($col['validation'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);

        $building->update([
            'name' => $data['name'],
            'construction_date' => $data['construction_date'],
            'tmv_start_date' => $data['tmv_start_date'],
            'floor_count' => $data['floor_count'],
            'ownership_status' => $data['ownership_status'],
            'purchase_price' => $data['purchase_price'],
            'purchase_date' => $data['purchase_date'],
            'rental_fee' => $data['rental_fee'],
            'lease_start' => $data['lease_start'],
            'lease_end' => $data['lease_end'],
            'land_id' => $data['land_id'],
        ]);

        $building->handleFileUploads($request);

        return redirect()->route('buildings.index')->with('success', 'Building updated successfully.');
    }

    public function destroy($id)
    {
        Building::findOrFail($id)->delete();

        return redirect()->route('buildings.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = Building::with('land');
        $data = $this->filterRepository->applyFilters($query, $request, $this->searchColumns);

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

    public function export(Request $request)
    {
        return $this->exportService->export($request, 'building_id', Building::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'building_id', Building::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(Building::class, $id, $request, ['building_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Building::class, 'building_id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Building::class, 'building_id');
    }
}
