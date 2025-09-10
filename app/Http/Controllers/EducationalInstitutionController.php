<?php

namespace App\Http\Controllers;

use App\Models\EducationalInstitution;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EducationalInstitutionController extends Controller
{
    use BulkDeleteTrait;
    use BulkEditTrait;
    use HasDependentDropdowns;

    protected $activityLogRepository;
    protected $filterRepository;
    protected $exportService;

    private $columns;
    private $fields;

    public $searchColumns = ['institution_code', 'name_en', 'name_tr', 'name_local', 'type', 'start_date', 'status', 'open_date', 'former_name'];

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
                'header' => 'Institution Code',
                'accessor' => 'institution_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Name',
                'accessor' => 'name_en',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Turkish Name',
                'accessor' => 'name_tr',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Local Name',
                'accessor' => 'name_local',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Type',
                'accessor' => 'type',
                'visibility' => true,
                'type' => 'select',
                'option' => ['School', 'Dormitory', 'Education Center', 'Other'],
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Stage',
                'accessor' => 'stage',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Level',
                'accessor' => 'level',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Campus',
                'accessor' => 'campus.name_en',
                'visibility' => true,
                'type' => 'link',
                'validation' => '',
                'context' => ['show'],
            ],
            [
                'header' => 'Campus',
                'accessor' => 'campus_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|integer|exists:campuses,campus_id',
                'search_url' => route('campuses.search'),
                'context' => ['edit', 'create'],
            ],
            [
                'header' => 'Start Date',
                'accessor' => 'start_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Status',
                'accessor' => 'status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['TMV Installation', 'Transfer from FETO', 'Transfer from 2nd Party'],
                'validation' => 'required|in:TMV Installation,Transfer from FETO,Transfer from 2nd Party',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Open Date',
                'accessor' => 'open_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Former Name',
                'accessor' => 'former_name',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
        ];
    }

    protected function getFields($institution = null)
    {
        return [
            [
                'name' => 'institution_code',
                'label' => 'Institution Code',
                'type' => 'string',
                'default' => $institution?->institution_code,
                'required' => true,
            ],
            [
                'name' => 'name_en',
                'label' => 'Name',
                'type' => 'string',
                'default' => $institution?->name_en,
                'required' => true,
            ],
            [
                'name' => 'name_tr',
                'label' => 'Turkish Name',
                'type' => 'string',
                'default' => $institution?->name_tr,
                'required' => true,
            ],
            [
                'name' => 'name_local',
                'label' => 'Local Name',
                'type' => 'string',
                'default' => $institution?->name_local,
                'required' => true,
            ],
            [
                'name' => 'type',
                'label' => 'Type',
                'type' => 'select',
                'option' => ['School', 'Dormitory', 'Education Center', 'Other'],
                'default' => $institution?->type,
                'required' => true,
            ],
            [
                'name' => 'stage',
                'label' => 'Stage',
                'type' => 'tag',
                'default' => $institution?->stage,
                'required' => false,
            ],
            [
                'name' => 'level',
                'label' => 'Level',
                'type' => 'tag',
                'default' => $institution?->level,
                'required' => false,
            ],
            [
                'name' => 'campus_id',
                'label' => 'Campus',
                'type' => 'link',
                'search_url' => route('campuses.search'),
                'default' => $institution?->campus_id,
                'required' => true,
            ],
            [
                'name' => 'start_date',
                'label' => 'Start Date',
                'type' => 'date',
                'default' => $institution?->start_date,
                'required' => true,
            ],
            [
                'name' => 'open_date',
                'label' => 'Open Date',
                'type' => 'date',
                'default' => $institution?->open_date,
                'required' => true,
            ],
            [
                'name' => 'status',
                'label' => 'Status',
                'type' => 'select',
                'option' => ['TMV Installation', 'Transfer from FETO', 'Transfer from 2nd Party'],
                'default' => $institution?->status,
                'required' => true,
            ],
            [
                'name' => 'former_name',
                'label' => 'Former Name',
                'type' => 'string',
                'default' => $institution?->former_name,
                'required' => false,
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('EducationalInstitution/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function create($id = null)
    {
        $institution = $id ? EducationalInstitution::findOrFail($id) : null;

        if ($id) {
            $institution = EducationalInstitution::with('campus')->where('institution_id', $id)->first();
        }

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        $options = [];
        // Map the editable columns to the desired format for fields
        $fields = array_map(function ($column) use ($options, $institution) {

            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $institution ? ($institution[$column['accessor']] ?? null) : null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];

            return $field; // Return the constructed field/ Return the constructed field
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('EducationalInstitution/Create', [
            'fields' => $fields,
            'educationalInstitution' => $institution,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $query = EducationalInstitution::with('campus');
        $data = $query->where('institution_id', $id)->first();

        return response()->json([
            'record' => $data,
        ]);
    }

    public function store(Request $request)
    {
        $rules = [];
        foreach ($this->columns as $col) {
            if (in_array('create', $col['context']) && isset($col['validation'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);
        EducationalInstitution::create($data);

        return redirect()->route('educational-institutions.index')->with('success', 'Educational Institution created.');
    }

    public function edit($id)
    {
        $institution = EducationalInstitution::with('campus')->findOrFail($id);

        $fields = $this->getFields($institution);

        return Inertia::render('EducationalInstitution/Edit', [
            'fields' => $fields,
            'institution' => $institution,
        ]);
    }

    public function update(Request $request, $id)
    {
        $institution = EducationalInstitution::findOrFail($id);

        $rules = [];
        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context']) && isset($col['validation'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);
        $institution->update($data);

        return redirect()->route('educational-institutions.index')->with('success', 'Educational Institution updated.');
    }

    public function destroy($id)
    {
        EducationalInstitution::findOrFail($id)->delete();

        return redirect()->route('educational-institutions.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = EducationalInstitution::with('campus');
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
        return $this->exportService->export($request, 'id', EducationalInstitution::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'id', EducationalInstitution::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(EducationalInstitution::class, $id, $request, ['id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, EducationalInstitution::class, 'id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, EducationalInstitution::class, 'id');
    }
}
