<?php

namespace App\Http\Controllers;

use App\Models\Campus;
use App\Models\Country;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CampusController extends Controller
{
    use BulkDeleteTrait;
    use BulkEditTrait;
    use HasDependentDropdowns;

    protected $activityLogRepository;

    protected $filterRepository;

    protected $exportService;

    private $columns;

    private $fields;

    public $searchColumns = ['campus_code', 'name_en', 'name_tr', 'name_local'];

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
                'header' => 'Campus Code',
                'accessor' => 'campus_code',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Only visible in the "show" view
            ],
            [
                'header' => 'Name (English)',
                'accessor' => 'name_en',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Only visible in the "show" view
            ],
            [
                'header' => 'Name (Turkish)',
                'accessor' => 'name_tr',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'Local Name',
                'accessor' => 'name_local',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'Phone',
                'accessor' => 'phone',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'Address',
                'accessor' => 'address',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'Country',
                'accessor' => 'country_id',
                'visibility' => true,
                'type' => 'link',
                'validation' => 'required|integer|exists:countries,country_id',
                'search_url' => route('countries.search'),
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Facebook URL',
                'accessor' => 'facebook_url',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|url|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Twitter URL',
                'accessor' => 'twitter_url',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|url|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Instagram URL',
                'accessor' => 'instagram_url',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|url|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'YouTube URL',
                'accessor' => 'youtube_url',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|url|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'LinkedIn URL',
                'accessor' => 'linkedin_url',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|url|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
        ];
    }

    protected function getFields($country = null)
    {
        return [
            [
                'label' => 'Campus Code',
                'name' => 'campus_code',
                'type' => 'string',
                'required' => true,
                'default' => $country?->campus_code,
            ],
            [
                'label' => 'Name (English)',
                'name' => 'name_en',
                'type' => 'string',
                'required' => true,
                'default' => $country?->name_en,
            ],
            [
                'label' => 'Name (Turkish)',
                'name' => 'name_tr',
                'type' => 'string',
                'required' => true,
                'default' => $country?->name_tr,
            ],
            [
                'label' => 'Local Name',
                'name' => 'name_local',
                'type' => 'string',
                'required' => true,
                'default' => $country?->name_local,
            ],
            [
                'label' => 'Phone',
                'name' => 'phone',
                'type' => 'string',
                'required' => true,
                'default' => $country?->phone,
            ],
            [
                'label' => 'Address',
                'name' => 'address',
                'type' => 'string',
                'required' => true,
                'default' => $country?->address,
            ],
            [
                'label' => 'Country',
                'name' => 'country_id',
                'type' => 'link',
                'required' => true,
                'default' => $country?->country_id,
                'search_url' => route('countries.search'),
            ],
            [
                'label' => 'Facebook URL',
                'name' => 'facebook_url',
                'type' => 'string',
                'required' => false,
                'default' => $country?->facebook_url,
            ],
            [
                'label' => 'Twitter URL',
                'name' => 'twitter_url',
                'type' => 'string',
                'required' => false,
                'default' => $country?->twitter_url,
            ],
            [
                'label' => 'Instagram URL',
                'name' => 'instagram_url',
                'type' => 'string',
                'required' => false,
                'default' => $country?->instagram_url,
            ],
            [
                'label' => 'YouTube URL',
                'name' => 'youtube_url',
                'type' => 'string',
                'required' => false,
                'default' => $country?->youtube_url,
            ],
            [
                'label' => 'LinkedIn URL',
                'name' => 'linkedin_url',
                'type' => 'string',
                'required' => false,
                'default' => $country?->linkedin_url,
            ],
        ];
    }

    public function index()
    {

        return Inertia::render('Campuses/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function search($search = null)
    {
        return $this->handleDependentSearch(
            Country::class,
            $search,
            null,
            null,
            null,
            'name',
            'country_id',
            null,
            null
        );
    }

    public function datatable(Request $request)
    {
        $query = Campus::query();
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

    /**
     * Show the form for creating a new resource.
     */
    public function create($id = null)
    {
        $campus = null;
        if ($id) {
            $campus = Campus::find($id);
        }

        $fields = $this->getFields($campus);

        return Inertia::render('Campuses/Create', [
            'fields' => $fields,
            'campus' => $campus,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        $validationRules = [];

        foreach ($editableColumns as $column) {
            if (isset($column['validation'])) {
                $validationRules[$column['accessor']] = $column['validation'];
            }
        }

        $validatedData = $request->validate($validationRules);
        Campus::create($validatedData);

        return redirect()->route('campuses.index')->with('success', 'Campus created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $query = Campus::query();
        $data = $query->where('campus_id', $id)->first();

        return response()->json([
            'record' => $data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $campus = Campus::findOrFail($id);

        $fields = $this->getFields($campus);

        return Inertia::render('Campuses/Edit', [
            'fields' => $fields,
            'campus' => $campus,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $campus = Campus::findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $validationRules = [];

        foreach ($editableColumns as $column) {
            if (isset($column['validation'])) {
                $validationRules[$column['accessor']] = $column['validation'];
            }
        }

        $validatedData = $request->validate($validationRules);

        // Update the campus's fields
        $campus->update($validatedData);

        return to_route('campuses.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $campus = Campus::where('campus_id', $id)->firstOrFail();

            $campus->delete();

            return redirect()
                ->route('campuses.index')
                ->with('success', 'Campus deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()
                ->route('campuses.index')
                ->with('error', 'Campus not found.');
        } catch (\Exception $e) {
            return redirect()
                ->route('campuses.index')
                ->with('error', 'An error occurred while deleting the campus.');
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Campus::class, 'campus_id');
    }

    // other functions

    public function export(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->export($request, 'campus_id', Campus::class, $columns);
    }

    public function pdf(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->pdf($request, 'campus_id', Campus::class, $columns);
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Campus::class, 'campus_id');
    }

    public function logActivity(Request $request, $id)
    {
        try {
            $response = $this->activityLogRepository->getLogs(Campus::class, $id, $request, ['id', 'causer.name', 'event']);

            return response()->json($response);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
