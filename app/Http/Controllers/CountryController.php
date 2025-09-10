<?php

namespace App\Http\Controllers;

use App\Models\Country;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CountryController extends Controller
{
    use BulkDeleteTrait;
    use BulkEditTrait;
    use HasDependentDropdowns;

    protected $activityLogRepository;

    protected $filterRepository;

    protected $exportService;

    private $columns;

    private $fields;

    public $searchColumns = ['country_code', 'name', 'name_tr', 'name_primary'];

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
                'header' => 'ID',
                'accessor' => 'country_id',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required|integer|exists:country,id',
                'context' => ['show'], // Only visible in the "show" view
            ],
            [
                'header' => 'Country Code',
                'accessor' => 'country_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Only visible in the "show" view
            ],
            [
                'header' => 'name',
                'accessor' => 'name',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'name_tr',
                'accessor' => 'name_tr',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'name_primary',
                'accessor' => 'name_primary',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],

        ];
    }

    protected function getFields($country = null)
    {
        return [
            [
                'label' => 'name',
                'name' => 'name',
                'type' => 'string',
                'required' => true,
                'default' => $country?->name,
            ],
            [
                'label' => 'Country Code',
                'name' => 'country_code',
                'type' => 'string',
                'required' => true,
                'default' => $country?->country_code,
            ],
            [
                'label' => 'name_tr',
                'name' => 'name_tr',
                'type' => 'string',
                'required' => true,
                'default' => $country?->name_tr,
            ],
            [
                'label' => 'name_primary',
                'name' => 'name_primary',
                'type' => 'string',
                'required' => true,
                'default' => $country?->name_primary,
            ],
        ];
    }

    public function index()
    {

        return Inertia::render('Countries/Index', [
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
        $query = Country::query();
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
        $country = null;
        if ($id) {
            $country = Country::find($id);
        }

        $fields = $this->getFields($country);

        return Inertia::render('Countries/Create', [
            'fields' => $fields,
            'country' => $country,
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
        $country = Country::create([
            'name' => $validatedData['name'],
            'country_code' => $validatedData['country_code'],
            'name_tr' => $validatedData['name_tr'],
            'name_primary' => $validatedData['name_primary'],
        ]);

        return redirect()->route('countries.index')->with('success', 'Country created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $query = Country::query();
        $data = $query->where('country_id', $id)->get();

        return response()->json([
            'records' => $data,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $country = Country::findOrFail($id);

        $fields = $this->getFields($country);

        return Inertia::render('Countries/Edit', [
            'fields' => $fields,
            'country' => $country,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $country = Country::findOrFail($id);

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

        // Update the country's fields
        $country->update([
            'name' => $validatedData['name'],
            'country_code' => $validatedData['country_code'],
            'name_tr' => $validatedData['name_tr'],
            'name_primary' => $validatedData['name_primary'],
        ]);

        return to_route('countries.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $country = Country::where('country_id', $id)->firstOrFail();

            $country->delete();

            return redirect()
                ->route('countries.index')
                ->with('success', 'Country deleted successfully.');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return redirect()
                ->route('countries.index')
                ->with('error', 'Country not found.');
        } catch (\Exception $e) {
            return redirect()
                ->route('countries.index')
                ->with('error', 'An error occurred while deleting the country.');
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Country::class, 'country_id');
    }

    // other functions

    public function export(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->export($request, 'country_id', Country::class, $columns);
    }

    public function pdf(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->pdf($request, 'country_id', Country::class, $columns);
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Country::class, 'country_id');
    }

    public function logActivity(Request $request, $id)
    {
        try {
            $response = $this->activityLogRepository->getLogs(\App\Models\Country::class, $id, $request, ['id', 'causer.name', 'event']);

            return response()->json($response);
        } catch (\Throwable $th) {
            dd($th);
        }
    }
}
