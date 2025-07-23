<?php

namespace App\Http\Controllers;

use App\Models\Land;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns;

    protected $activityLogRepository;
    protected $filterRepository;
    protected $exportService;

    private $columns;
    private $fields;

    public $searchColumns = ['land_code', 'address', 'province', 'district', 'neighborhood', 'street', 'door_number', 'country_land_number', 'size_sqm', 'tmv_start_date', 'ownership_status', 'purchase_price', 'purchase_date', 'purchase_docs', 'rental_fee', 'lease_start', 'lease_end', 'lease_docs', ''];

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
                'header' => 'Land Code',
                'accessor' => 'land_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Address',
                'accessor' => 'address',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Province',
                'accessor' => 'province',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'District',
                'accessor' => 'district',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Neighborhood',
                'accessor' => 'neighborhood',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Street',
                'accessor' => 'street',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Door Number',
                'accessor' => 'door_number',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Country Land Number',
                'accessor' => 'country_land_number',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Size SqM',
                'accessor' => 'size_sqm',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'TMV Start Date',
                'accessor' => 'tmv_start_date',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'required|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Ownership Status',
                'accessor' => 'ownership_status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['TMV', 'Rent'],
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Purchase Price',
                'accessor' => 'purchase_price',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Purchase Date',
                'accessor' => 'purchase_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Purchase Docs',
                'accessor' => 'purchase_docs',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Rental Fee',
                'accessor' => 'rental_fee',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lease Start',
                'accessor' => 'lease_start',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lease End',
                'accessor' => 'lease_end',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'required|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lease Docs',
                'accessor' => 'lease_docs',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Allocation Docs',
                'accessor' => 'allocation_docs',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Layout Plan',
                'accessor' => 'layout_plan',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Features',
                'accessor' => 'features',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Photos',
                'accessor' => 'photos',
                'visibility' => false,
                'type' => 'tag',
                'validation' => 'required|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Country',
                'accessor' => 'country.name',
                'visibility' => true,
                'type' => 'link',
                'validation' => '',
                'context' => ['show'],
            ],
            [
                'header' => 'Country',
                'accessor' => 'country_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|integer|exists:countries,country_id',
                'search_url' => route('countries.search'),
                'context' => ['edit', 'create'],
            ],
        ];
    }

    protected function getFields($land = null)
    {
        return [
            [
                'name' => 'land_code',
                'label' => 'Land Code',
                'type' => 'string',
                'default' => $land?->land_code,
                'required' => true,
            ],
            [
                'name' => 'address',
                'label' => 'Address',
                'type' => 'string',
                'default' => $land?->address,
                'required' => true,
            ],
            [
                'name' => 'province',
                'label' => 'Province',
                'type' => 'string',
                'default' => $land?->province,
                'required' => true,
            ],
            [
                'name' => 'district',
                'label' => 'District',
                'type' => 'string',
                'default' => $land?->district,
                'required' => true,
            ],
            [
                'name' => 'neighborhood',
                'label' => 'Neighborhood',
                'type' => 'string',
                'default' => $land?->neighborhood,
                'required' => true,
            ],
            [
                'name' => 'street',
                'label' => 'Street',
                'type' => 'string',
                'default' => $land?->street,
                'required' => true,
            ],
            [
                'name' => 'door_number',
                'label' => 'Door Number',
                'type' => 'string',
                'default' => $land?->door_number,
                'required' => true,
            ],
            [
                'name' => 'country_land_number',
                'label' => 'Country Land Number',
                'type' => 'string',
                'default' => $land?->country_land_number,
                'required' => true,
            ],
            [
                'name' => 'size_sqm',
                'label' => 'Size SqM',
                'type' => 'number',
                'default' => $land?->size_sqm,
                'required' => true,
            ],
            [
                'name' => 'tmv_start_date',
                'label' => 'TMV Start Date',
                'type' => 'date',
                'default' => $land?->tmv_start_date,
                'required' => true,
            ],
            [
                'name' => 'ownership_status',
                'label' => 'Ownership Status',
                'type' => 'select',
                'option' => ['TMV', 'Rent'],
                'default' => $land?->ownership_status,
                'required' => true,
            ],
            [
                'name' => 'purchase_price',
                'label' => 'Purchase Price',
                'type' => 'number',
                'default' => $land?->purchase_price,
                'required' => true,
            ],
            [
                'name' => 'purchase_date',
                'label' => 'Purchase Date',
                'type' => 'date',
                'default' => $land?->purchase_date,
                'required' => true,
            ],
            [
                'name' => 'purchase_docs',
                'label' => 'Purchase Docs',
                'type' => 'tag',
                'default' => $land?->purchase_docs,
                'required' => true,
            ],
            [
                'name' => 'rental_fee',
                'label' => 'Rental Fee',
                'type' => 'number',
                'default' => $land?->rental_fee,
                'required' => true,
            ],
            [
                'name' => 'lease_start',
                'label' => 'Lease Start',
                'type' => 'date',
                'default' => $land?->lease_start,
                'required' => true,
            ],
            [
                'name' => 'lease_end',
                'label' => 'Lease End',
                'type' => 'date',
                'default' => $land?->lease_end,
                'required' => true,
            ],
            [
                'name' => 'lease_docs',
                'label' => 'Lease Docs',
                'type' => 'tag',
                'default' => $land?->lease_docs,
                'required' => true,
            ],
            [
                'name' => 'allocation_docs',
                'label' => 'Allocation Docs',
                'type' => 'tag',
                'default' => $land?->allocation_docs,
                'required' => true,
            ],
            [
                'name' => 'layout_plan',
                'label' => 'Layout Plan',
                'type' => 'tag',
                'default' => $land?->layout_plan,
                'required' => true,
            ],
            [
                'name' => 'features',
                'label' => 'Features',
                'type' => 'tag',
                'default' => $land?->features,
                'required' => true,
            ],
            [
                'name' => 'photos',
                'label' => 'Photos',
                'type' => 'tag',
                'default' => $land?->photos,
                'required' => true,
            ],
            [
                'name' => 'country.name',
                'label' => 'Country',
                'type' => 'link',
                'default' => $land?->country?->name_en,
                'required' => false,
            ],
            [
                'name' => 'country_id',
                'label' => 'Country',
                'type' => 'link',
                'search_url' => route('countries.search'),
                'default' => $land?->country_id,
                'required' => true,
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('Lands/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function search($search = null)
    {
        return $this->handleDependentSearch(
            Land::class,
            $search,
            null,
            null,
            null,
            'name',
            'land_id',
            function ($land) {
                return $land->land_code;
            },
            null
        );
    }

    public function create($id = null)
    {
        $land = $id ? Land::findOrFail($id) : null;

        if ($id) {
            $land = Land::with('country')->where('land_id', $id)->first();
        }

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        $options = [];
        // Map the editable columns to the desired format for fields
        $fields = array_map(function ($column) use ($options, $land) {

            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $land ? ($land[$column['accessor']] ?? null) : null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];

            return $field; // Return the constructed field/ Return the constructed field
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('Lands/Create', [
            'fields' => $fields,
            'Land' => $land,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $query = Land::with('country');
        $data = $query->where('land_id', $id)->first();

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
        Land::create($data);

        return redirect()->route('Lands.index')->with('success', 'Land created successfully.');
    }

    public function edit($id)
    {
        $institution = Land::with('country')->findOrFail($id);

        $fields = $this->getFields($institution);

        return Inertia::render('Lands/Edit', [
            'fields' => $fields,
            'institution' => $institution,
        ]);
    }

    public function update(Request $request, $id)
    {
        $institution = Land::findOrFail($id);

        $rules = [];
        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context']) && isset($col['validation'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);
        $institution->update($data);

        return redirect()->route('lands.index')->with('success', 'Land updated successfully.');
    }

    public function destroy($id)
    {
        Land::findOrFail($id)->delete();

        return redirect()->route('lands.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = Land::with('country');
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
        return $this->exportService->export($request, 'id', Land::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'id', Land::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(Land::class, $id, $request, ['id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Land::class, 'id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Land::class, 'id');
    }
}
