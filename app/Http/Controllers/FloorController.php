<?php

namespace App\Http\Controllers;

use App\Models\Floor;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FloorController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns;

    protected $columns;
    protected $fields;
    protected $exportService;
    protected $activityLogRepository;
    protected $filterRepository;

    public $searchColumns = ['floor_code', 'floor_level', 'building.building_code'];

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
                'header' => 'Floor Code',
                'accessor' => 'floor_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:floors,floor_code',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Floor Level',
                'accessor' => 'floor_level',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Building',
                'accessor' => 'building.name',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|exists:buildings,building_id',
                'context' => ['show'],
            ],
            [
                'header' => 'Building',
                'accessor' => 'building_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|exists:buildings,building_id',
                'search_url' => route('buildings.search'),
                'context' => ['edit', 'create'],
            ],
        ];
    }

    protected function getFields($floor = null)
    {
        return [
            [
                'name' => 'floor_code',
                'label' => 'Floor Code',
                'type' => 'string',
                'default' => $floor?->floor_code,
                'required' => true,
            ],
            [
                'name' => 'floor_level',
                'label' => 'Floor Level',
                'type' => 'string',
                'default' => $floor?->floor_level,
                'required' => true,
            ],
            [
                'name' => 'building_id',
                'label' => 'Building',
                'type' => 'link',
                'default' => $floor?->building_id,
                'search_url' => route('buildings.search'),
                'required' => true,
            ]
        ];
    }

    public function index()
    {
        return Inertia::render('Floors/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function search($search = null)
    {
        return $this->handleDependentSearch(
            Floor::class,
            $search,
            null,
            null,
            null,
            'floor_code',
            'floor_id',
            function ($floor) {
                return $floor->floor_code . ' ' . $floor->floor_level;
            },
            null
        );
    }

    public function create($id = null)
    {
        $floor = $id ? Floor::findOrFail($id) : null;

        if ($id) {
            $floor = Floor::with('building')->where('floor_id', $id)->first();
        }

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        // Map the editable columns to the desired format for fields
        $fields = array_map(function ($column) use ($floor) {

            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $floor ? ($floor[$column['accessor']] ?? null) : null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];

            return $field;
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('Floors/Create', [
            'fields' => $fields,
        ]);
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
        Floor::create($data);

        return redirect()->route('floors.index')->with('success', 'Floor created successfully.');
    }

    public function show($id)
    {
        $floor = Floor::with('building')->where('floor_id', $id)->firstOrFail();
        return response()->json(['record' => $floor]);
    }

    public function edit($id)
    {
        $floor = Floor::findOrFail($id);
        $fields = $this->getFields($floor);

        return Inertia::render('Floors/Edit', [
            'fields' => $fields,
            'floor' => $floor,
        ]);
    }

    public function update(Request $request, $id)
    {
        $floor = Floor::findOrFail($id);
        $rules = [];

        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context'])) {
                $rules[$col['accessor']] = str_replace('unique:floors,floor_code', 'unique:floors,floor_code,' . $floor->floor_id . ',floor_id', $col['validation']);
            }
        }

        $data = $request->validate($rules);
        $floor->update($data);

        return redirect()->route('floors.index')->with('success', 'Floor updated successfully.');
    }

    public function destroy($id)
    {
        Floor::findOrFail($id)->delete();
        return redirect()->route('floors.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = Floor::with('building');
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
        return $this->exportService->export($request, 'floor_id', Floor::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'floor_id', Floor::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(Floor::class, $id, $request, ['floor_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Floor::class, 'floor_id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Floor::class, 'floor_id');
    }
}
