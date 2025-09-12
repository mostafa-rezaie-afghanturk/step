<?php

namespace App\Http\Controllers;

use App\Models\AssetAssignment;
use App\Models\User;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AssetAssignmentController extends Controller
{
    protected $columns;
    protected $fields;
    protected $exportService;
    protected $activityLogRepository;
    protected $filterRepository;

    public $searchColumns = ['assigned_by_name', 'assignee_name', 'asset_code', 'status', 'assigned_at'];

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
                'header' => 'ID',
                'accessor' => 'asset_assignment_id',
                'visibility' => true,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show'],
            ],
            [
                'header' => 'Assigned At',
                'accessor' => 'assigned_at',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'required|date|before_or_equal:today',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Assigned By',
                'accessor' => 'assigned_by_user_id',
                'visibility' => true,
                'type' => 'link',
                'search_url' => route('users.search'),
                'validation' => 'required|exists:users,id',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Assignee',
                'accessor' => 'assignee_user_id',
                'visibility' => true,
                'type' => 'link',
                'search_url' => route('users.search'),
                'validation' => 'required|exists:users,id',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Asset Type',
                'accessor' => 'asset_type',
                'visibility' => true,
                'type' => 'select',
                'option' => [
                    'Fixture/Furnishing',
                    'Educational Material'
                ],
                'validation' => 'required|in:Fixture/Furnishing,Educational Material',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Asset Code',
                'accessor' => 'asset_id',
                'visibility' => true,
                'type' => 'link',
                'search_url' => route('assets.search'),
                'validation' => 'required',
                'context' => ['show', 'edit', 'create'],
                'depends_on' => 'asset_type',
            ],
            [
                'header' => 'Status',
                'accessor' => 'status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Assigned', 'Unassigned'],
                'validation' => 'required|in:Assigned,Unassigned',
                'context' => ['show', 'edit'],
            ],
            [
                'header' => 'Notes',
                'accessor' => 'notes',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|string|max:1000',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
        ];
    }

    private function mapTypeLabelToClass(?string $label): ?string
    {
        if ($label === 'Fixture/Furnishing') {
            return \App\Models\FixtureFurnishing::class;
        }
        if ($label === 'Educational Material') {
            return \App\Models\EducationalMaterial::class;
        }
        return $label;
    }

    private function mapTypeClassToLabel(?string $class): ?string
    {
        if ($class === \App\Models\FixtureFurnishing::class) {
            return 'Fixture/Furnishing';
        }
        if ($class === \App\Models\EducationalMaterial::class) {
            return 'Educational Material';
        }
        return $class;
    }

    public function index()
    {
        return Inertia::render('Assignments/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function create($id = null)
    {
        $assignment = $id ? AssetAssignment::findOrFail($id) : null;

        if ($id) {
            $assignment = AssetAssignment::with('assignedBy', 'assignee')->where('asset_assignment_id', $id)->first();
        }

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        $fields = array_map(function ($column) use ($assignment) {
            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $assignment ? ($assignment[$column['accessor']] ?? null) : null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];
            if ($column['accessor'] === 'asset_type' && $field['default']) {
                $field['default'] = $this->mapTypeClassToLabel($field['default']);
            }
            return $field;
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('Assignments/Create', [
            'fields' => $fields,
            'assignment' => $assignment,
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
        $typeClass = $this->mapTypeLabelToClass($data['asset_type'] ?? null);

        $existing = AssetAssignment::where('asset_type', $typeClass)
            ->where('asset_id', $data['asset_id'])
            ->where('status', 'Assigned')
            ->exists();
        if ($existing) {
            return redirect()->back()->withErrors(['asset_id' => 'This asset is already assigned to someone else.']);
        }

        AssetAssignment::create([
            'assigned_by_user_id' => $data['assigned_by_user_id'],
            'assignee_user_id' => $data['assignee_user_id'],
            'asset_type' => $typeClass,
            'asset_id' => $data['asset_id'],
            'assigned_at' => $data['assigned_at'],
            'notes' => $data['notes'] ?? null,
            'status' => 'Assigned',
        ]);

        return redirect()->route('asset-assignments.index')->with('success', 'Assignment created successfully.');
    }

    public function show($id)
    {
        $assignment = AssetAssignment::with(['assignedBy', 'assignee'])->findOrFail($id);

        $currentType = $assignment->asset_type;
        $mappedType = $this->mapTypeLabelToClass($currentType);
        if ($mappedType !== $currentType) {
            $temp = clone $assignment;
            $temp->setAttribute('asset_type', $mappedType);
            try {
                $temp->load('asset');
                $assignment->setRelation('asset', $temp->getRelation('asset'));
                $assignment->asset_type = $mappedType;
            } catch (\Throwable $e) {
                // ignore
            }
        } else {
            $assignment->load('asset');
        }

        return response()->json(['record' => $assignment]);
    }

    public function edit($id)
    {
        $assignment = AssetAssignment::with(['assignedBy', 'assignee'])->findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $fields = array_map(function ($column) use ($assignment) {
            $default = $assignment ? ($assignment[$column['accessor']] ?? null) : null;
            if ($column['accessor'] === 'asset_type' && $default) {
                $default = $this->mapTypeClassToLabel($default);
            }
            return [
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
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('Assignments/Edit', [
            'fields' => $fields,
            'assignment' => $assignment,
        ]);
    }

    public function update(Request $request, $id)
    {
        $assignment = AssetAssignment::findOrFail($id);
        $rules = [];
        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }
        $data = $request->validate($rules);
        $typeClass = $this->mapTypeLabelToClass($data['asset_type'] ?? null);

        $assignment->update([
            'assigned_by_user_id' => $data['assigned_by_user_id'],
            'assignee_user_id' => $data['assignee_user_id'],
            'asset_type' => $typeClass,
            'asset_id' => $data['asset_id'],
            'assigned_at' => $data['assigned_at'],
            'status' => $data['status'],
            'notes' => $data['notes'] ?? null,
        ]);

        return redirect()->route('asset-assignments.index')->with('success', 'Assignment updated successfully.');
    }

    public function destroy($id)
    {
        AssetAssignment::findOrFail($id)->delete();
        return redirect()->route('asset-assignments.index')->with('success', 'Assignment deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = AssetAssignment::with(['assignedBy', 'assignee'])
            ->select('asset_assignments.*')
            ->addSelect([
                'assigned_by_name' => User::select('name')->whereColumn('id', 'asset_assignments.assigned_by_user_id')->limit(1),
                'assignee_name' => User::select('name')->whereColumn('id', 'asset_assignments.assignee_user_id')->limit(1),
                'asset_code' => DB::raw("
                    CASE
                        WHEN asset_type = 'App\\\\Models\\\\FixtureFurnishing' THEN
                            (SELECT asset_code FROM fixtures_furnishings WHERE fixture_furnishing_id = asset_id)
                        WHEN asset_type = 'App\\\\Models\\\\EducationalMaterial' THEN
                            (SELECT asset_code FROM educational_materials WHERE educational_material_id = asset_id)
                        ELSE 'Unknown'
                    END
                "),
            ]);

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
        return $this->exportService->export($request, 'asset_assignment_id', AssetAssignment::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'asset_assignment_id', AssetAssignment::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(AssetAssignment::class, $id, $request, ['asset_assignment_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function unassign(Request $request, $id)
    {
        $assignment = AssetAssignment::findOrFail($id);
        if ($assignment->status !== 'Assigned') {
            return redirect()->back()->withErrors(['status' => 'This assignment is not currently active.']);
        }
        $assignment->update(['status' => 'Unassigned']);
        return redirect()->route('asset-assignments.index')->with('success', 'Asset unassigned successfully');
    }
}
