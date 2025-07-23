<?php

namespace App\Http\Controllers;

use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Repositories\ExportService;
use App\Repositories\ActivityLogRepository;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;

class BuildingController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns;

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
        $this->fields = $this->getFields();
        $this->exportService = $exportService;
        $this->activityLogRepository = $activityLogRepository;
        $this->filterRepository = $filterRepository;
    }

    protected function getColumns()
    {
        return [
            [
                'header' => 'Building Code',
                'accessor' => 'building_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:buildings,building_code',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Name',
                'accessor' => 'name',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Construction Date',
                'accessor' => 'construction_date',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'TMV Start Date',
                'accessor' => 'tmv_start_date',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Floor Count',
                'accessor' => 'floor_count',
                'visibility' => true,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Ownership Status',
                'accessor' => 'ownership_status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['TMV', 'Rent'],
                'validation' => 'required|string|in:TMV,Rent',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Purchase Price',
                'accessor' => 'purchase_price',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Purchase Date',
                'accessor' => 'purchase_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Purchase Docs',
                'accessor' => 'purchase_docs',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'nullable|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Rental Fee',
                'accessor' => 'rental_fee',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lease Start',
                'accessor' => 'lease_start',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lease End',
                'accessor' => 'lease_end',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lease Docs',
                'accessor' => 'lease_docs',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'nullable|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Allocation Docs',
                'accessor' => 'allocation_docs',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'nullable|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Building Project',
                'accessor' => 'building_project',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'nullable|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Land',
                'accessor' => 'land_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|integer|exists:lands,land_id',
                'search_url' => route('lands.search'),
                'context' => ['edit', 'create'],
            ],
        ];
    }

    protected function getFields($building = null)
    {
        return array_map(function ($column) use ($building) {
            return [
                'name' => $column['accessor'],
                'label' => $column['header'],
                'type' => $column['type'],
                'option' => $column['option'] ?? null,
                'default' => $building ? data_get($building, $column['accessor']) : null,
                'required' => str_contains($column['validation'], 'required'),
            ];
        }, $this->getColumns());
    }

    public function index()
    {
        return Inertia::render('Buildings/Index', ['columns' => $this->columns]);
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
            ];
        }, $editableColumns);

        return Inertia::render('Buildings/Create', [
            'fields' => $fields,
            'Building' => $building,
        ]);
    }

    public function show(string $id)
    {
        $data = Building::with('land')->where('building_id', $id)->first();
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
        Building::create($data);

        return redirect()->route('buildings.index')->with('success', 'Building created successfully.');
    }

    public function edit($id)
    {
        $building = Building::with('land')->findOrFail($id);
        $fields = $this->getFields($building);

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
            if (in_array('edit', $col['context'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);
        $building->update($data);

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
