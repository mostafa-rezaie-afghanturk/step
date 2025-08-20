<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\FixtureFurnishing;
use App\Models\Floor;
use App\Models\Land;
use App\Models\Room;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FixtureFurnishingController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns;

    protected $columns;
    protected $fields;
    protected $exportService;
    protected $activityLogRepository;
    protected $filterRepository;

    public $searchColumns = ['asset_code', 'tmv_code', 'group', 'subgroup', 'status'];

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
                'header' => 'Asset Code',
                'accessor' => 'asset_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:fixtures_furnishings,asset_code',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'TMV Code',
                'accessor' => 'tmv_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Group',
                'accessor' => 'group',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Furniture', 'White Goods', 'Electronics', 'Technical'],
                'validation' => 'required|in:Furniture,White Goods,Electronics,Technical',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Subgroup',
                'accessor' => 'subgroup',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Status',
                'accessor' => 'status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Very good', 'Good', 'Maintenance required', 'Unusable', 'Scrap'],
                'validation' => 'required|in:Very good,Good,Maintenance required,Unusable,Scrap',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Usage',
                'accessor' => 'usage',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Active', 'Passive'],
                'validation' => 'required|in:Active,Passive',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Available Date',
                'accessor' => 'available_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Supply Method',
                'accessor' => 'supply_method',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Purchase', 'Donation', 'Transfer from FETO'],
                'validation' => 'required|in:Purchase,Donation,Transfer from FETO',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Supply Info',
                'accessor' => 'supply_info',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Price',
                'accessor' => 'price',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric|min:0',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Manufacturer',
                'accessor' => 'manufacturer',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Production Site',
                'accessor' => 'production_site',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Production Date',
                'accessor' => 'production_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Related Level',
                'accessor' => 'related_level',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Preschool', 'Primary School', 'Middle School', 'High School', 'Other'],
                'validation' => 'nullable|in:Preschool,Primary School,Middle School,High School,Other',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Photo',
                'accessor' => 'asset_photo',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
            [
                'header' => 'Lifespan (Years)',
                'accessor' => 'lifespan',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|integer|min:0',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Start Date',
                'accessor' => 'start_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Warranty Start',
                'accessor' => 'warranty_start',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Warranty End',
                'accessor' => 'warranty_end',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Warranty Certificate',
                'accessor' => 'warranty_cert',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
            [
                'header' => 'Brand',
                'accessor' => 'brand',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Model',
                'accessor' => 'model',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Maintenance Notes',
                'accessor' => 'maintenance_notes',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|string',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
            [
                'header' => 'Service Info',
                'accessor' => 'service_info',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Calibration Required',
                'accessor' => 'calibration_required',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Calibration History',
                'accessor' => 'calibration_history',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|string',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'calibration_required,true',
                'width' => 2
            ],
            [
                'header' => 'Location Type',
                'accessor' => 'location_type',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Room', 'Floor', 'Building', 'Land'],
                'validation' => 'required|in:Room,Floor,Building,Land',
                'context' => ['edit', 'create'],
            ],
            [
                'header' => 'Location',
                'accessor' => 'location_id',
                'visibility' => false,
                'type' => 'link',
                'search_url' => route('locations.search'),
                'validation' => 'required|integer',
                'context' => ['edit', 'create'],
                'depends_on' => 'location_type',
            ],
            [
                'header' => 'Location Type',
                'accessor' => 'location_type',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required',
                'context' => ['show'],
            ],
            [
                'header' => 'Technical Specifications',
                'accessor' => 'technical_specifications',
                'visibility' => false,
                'type' => 'json_counter_list',
                'option' => [
                    'Dimensions',
                    'Weight',
                    'Power Requirements',
                    'Material',
                    'Color',
                    'Capacity',
                    'Features'
                ],
                'validation' => 'nullable|array',
                'context' => ['show', 'edit', 'create'],
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('FixtureFurnishings/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function location($search = null)
    {
        $locationType = request()->get('location_type');

        if (empty($locationType)) {
            return response()->json([]);
        }

        if ($locationType === 'Land') {
            $modelClass = Land::class;
            $searchField = 'land_id';
            $labelCallback = function ($land) {
                return $land->land_code;
            };
            $filterCallback = null;
        } elseif ($locationType === 'Building') {
            $modelClass = Building::class;
            $searchField = 'building_id';
            $labelCallback = function ($building) {
                return $building->building_code . ' - ' . $building->name;
            };
            $filterCallback = null;
        } elseif ($locationType === 'Floor') {
            $modelClass = Floor::class;
            $searchField = 'floor_id';
            $labelCallback = function ($floor) {
                return $floor->floor_code . ' - ' . $floor->floor_level;
            };
            $filterCallback = null;
        } else {
            $modelClass = Room::class;
            $searchField = 'room_id';
            $labelCallback = function ($room) {
                return $room->room_code . ' - ' . $room->name;
            };
            $filterCallback = null;
        }

        return $this->handleDependentSearch(
            $modelClass,
            $search,
            null,
            null,
            null,
            'name',
            $searchField,
            $labelCallback ?? null,
            $filterCallback ?? null
        );
    }

    public function create($id = null)
    {
        $editableColumns = array_filter($this->getColumns(), fn($col) => in_array('create', $col['context']));

        $fields = array_map(function ($column) {
            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
                'required_if' => $column['required_if'] ?? null,
            ];

            return $field;
        }, $editableColumns);

        $fields = array_values($fields);

        return Inertia::render('FixtureFurnishings/Create', ['fields' => $fields]);
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

        switch ($data['location_type']) {
            case 'Land':
                $locationType = 'App\\Models\\Land';
                break;
            case 'Building':
                $locationType = 'App\\Models\\Building';
                break;
            case 'Floor':
                $locationType = 'App\\Models\\Floor';
                break;
            case 'Room':
                $locationType = 'App\\Models\\Room';
                break;
            default:
                $locationType = null;
        }

        $fixtureFurnishing = FixtureFurnishing::create([
            'asset_code' => $data['asset_code'],
            'tmv_code' => $data['tmv_code'],
            'group' => $data['group'],
            'subgroup' => $data['subgroup'],
            'status' => $data['status'],
            'usage' => $data['usage'],
            'available_date' => $data['available_date'],
            'supply_method' => $data['supply_method'],
            'supply_info' => $data['supply_info'],
            'price' => $data['price'],
            'manufacturer' => $data['manufacturer'],
            'production_site' => $data['production_site'],
            'production_date' => $data['production_date'],
            'technical_specifications' => json_encode($data['technical_specifications'] ?? []),
            'related_level' => $data['related_level'],
            'lifespan' => $data['lifespan'],
            'start_date' => $data['start_date'],
            'warranty_start' => $data['warranty_start'],
            'warranty_end' => $data['warranty_end'],
            'brand' => $data['brand'],
            'model' => $data['model'],
            'maintenance_notes' => $data['maintenance_notes'],
            'service_info' => $data['service_info'],
            'calibration_required' => $data['calibration_required'] ?? false,
            'calibration_history' => json_encode($data['calibration_history'] ?? []),
            'location_type' => $locationType,
            'location_id' => $data['location_id'],
        ]);

        $fixtureFurnishing->handleFileUploads($request);

        return redirect()->route('fixture-furnishings.index')->with('success', 'Fixture/Furnishing created successfully.');
    }

    public function show($id)
    {
        $fixtureFurnishing = FixtureFurnishing::with(['location', 'warrantyCerts'])->where('fixture_furnishing_id', $id)->firstOrFail();

        return response()->json(['record' => $fixtureFurnishing]);
    }

    public function edit($id)
    {
        $fixtureFurnishing = FixtureFurnishing::with('warrantyCerts')->findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $fields = array_map(function ($column) use ($fixtureFurnishing) {
            $default = $fixtureFurnishing ? ($fixtureFurnishing[$column['accessor']] ?? null) : null;

            // Handle JSON fields
            if ($fixtureFurnishing) {
                switch ($column['accessor']) {
                    case 'technical_specifications':
                        $default = $fixtureFurnishing->technical_specifications ? json_decode($fixtureFurnishing->technical_specifications, true) : [];
                        break;
                    case 'location_type':
                        $default = class_basename($fixtureFurnishing->location_type);
                        break;
                    case 'warranty_cert':
                        $default = $fixtureFurnishing->warrantyCerts ? $fixtureFurnishing->warrantyCerts->map(function ($file) {
                            return url('storage/' . $file->file_path);
                        })->toArray() : [];
                        break;
                    case 'asset_photo':
                        $default = $fixtureFurnishing->assetPhotos ? $fixtureFurnishing->assetPhotos->map(function ($file) {
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

        return Inertia::render('FixtureFurnishings/Edit', [
            'fields' => $fields,
            'fixtureFurnishing' => $fixtureFurnishing,
        ]);
    }

    public function update(Request $request, $id)
    {
        $fixtureFurnishing = FixtureFurnishing::findOrFail($id);
        $rules = [];

        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context'])) {
                $rule = $col['validation'];
                if (str_contains($rule, 'unique:fixtures_furnishings,asset_code')) {
                    $rule = str_replace(
                        'unique:fixtures_furnishings,asset_code',
                        'unique:fixtures_furnishings,asset_code,' . $fixtureFurnishing->fixture_furnishing_id . ',fixture_furnishing_id',
                        $rule
                    );
                }
                $rules[$col['accessor']] = $rule;
            }
        }

        $data = $request->validate($rules);

        switch ($data['location_type']) {
            case 'Land':
                $locationType = 'App\\Models\\Land';
                break;
            case 'Building':
                $locationType = 'App\\Models\\Building';
                break;
            case 'Floor':
                $locationType = 'App\\Models\\Floor';
                break;
            case 'Room':
                $locationType = 'App\\Models\\Room';
                break;
            default:
                $locationType = null;
        }

        $fixtureFurnishing->update([
            'asset_code' => $data['asset_code'],
            'tmv_code' => $data['tmv_code'],
            'group' => $data['group'],
            'subgroup' => $data['subgroup'],
            'status' => $data['status'],
            'usage' => $data['usage'],
            'available_date' => $data['available_date'],
            'supply_method' => $data['supply_method'],
            'supply_info' => $data['supply_info'],
            'price' => $data['price'],
            'manufacturer' => $data['manufacturer'],
            'production_site' => $data['production_site'],
            'production_date' => $data['production_date'],
            'technical_specifications' => json_encode($data['technical_specifications'] ?? []),
            'related_level' => $data['related_level'],
            'lifespan' => $data['lifespan'],
            'start_date' => $data['start_date'],
            'warranty_start' => $data['warranty_start'],
            'warranty_end' => $data['warranty_end'],
            'brand' => $data['brand'],
            'model' => $data['model'],
            'maintenance_notes' => $data['maintenance_notes'],
            'service_info' => $data['service_info'],
            'calibration_required' => $data['calibration_required'] ?? false,
            'calibration_history' => $data['calibration_history'],
            'location_type' => $locationType,
            'location_id' => $data['location_id'],
        ]);

        $fixtureFurnishing->handleFileUploads($request);

        return redirect()->route('fixture-furnishings.index')->with('success', 'Fixture/Furnishing updated successfully.');
    }

    public function destroy($id)
    {
        FixtureFurnishing::findOrFail($id)->delete();
        return redirect()->route('fixture-furnishings.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = FixtureFurnishing::with('location');
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
        return $this->exportService->export($request, 'fixture_furnishing_id', FixtureFurnishing::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'fixture_furnishing_id', FixtureFurnishing::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(FixtureFurnishing::class, $id, $request, ['fixture_furnishing_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, FixtureFurnishing::class, 'fixture_furnishing_id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, FixtureFurnishing::class, 'fixture_furnishing_id');
    }

    public function search($search = null)
    {
        $query = FixtureFurnishing::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('asset_code', 'like', "%{$search}%")
                    ->orWhere('tmv_code', 'like', "%{$search}%")
                    ->orWhere('subgroup', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            });
        }

        $results = $query->limit(10)->get(['fixture_furnishing_id', 'asset_code', 'tmv_code', 'subgroup', 'brand', 'model']);

        return response()->json($results);
    }
}
