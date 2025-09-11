<?php

namespace App\Http\Controllers;

use App\Models\Building;
use App\Models\EducationalMaterial;
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
use App\Traits\GeneratesBarcode;

class EducationalMaterialController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns, GeneratesBarcode;

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
                'header' => 'id',
                'accessor' => 'educational_material_id',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show'],
            ],
            [
                'header' => 'asset_code',
                'accessor' => 'asset_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:educational_materials,asset_code',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'tmv_code',
                'accessor' => 'tmv_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'group',
                'accessor' => 'group',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Science', 'Chemistry', 'Physics', 'Biology', 'Mathematics', 'Literature', 'History', 'Geography', 'Art', 'Music', 'Physical Education', 'Technology', 'Other'],
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],

            [
                'header' => 'subgroup',
                'accessor' => 'subgroup',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'status',
                'accessor' => 'status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Very good', 'Good', 'Maintenance required', 'Unusable'],
                'validation' => 'required|in:Very good,Good,Maintenance required,Unusable',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'usage',
                'accessor' => 'usage',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Active', 'Passive'],
                'validation' => 'required|in:Active,Passive',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'available_date',
                'accessor' => 'available_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'supply_method',
                'accessor' => 'supply_method',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Purchase', 'Donation', 'Transfer from FETO'],
                'validation' => 'required|in:Purchase,Donation,Transfer from FETO',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'supply_info',
                'accessor' => 'supply_info',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'price',
                'accessor' => 'price',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric|min:0',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'manufacturer',
                'accessor' => 'manufacturer',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'production_site',
                'accessor' => 'production_site',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'production_date',
                'accessor' => 'production_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'related_level',
                'accessor' => 'related_level',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Preschool', 'Primary School', 'Middle School', 'High School', 'Other'],
                'validation' => 'nullable|in:Preschool,Primary School,Middle School,High School,Other',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'photo',
                'accessor' => 'asset_photo',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
            [
                'header' => 'lifespan',
                'accessor' => 'lifespan',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|integer|min:0',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'start_date',
                'accessor' => 'start_date',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'warranty_start',
                'accessor' => 'warranty_start',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'warranty_end',
                'accessor' => 'warranty_end',
                'visibility' => false,
                'type' => 'date',
                'validation' => 'nullable|date',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'warranty_cert',
                'accessor' => 'warranty_cert',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
            [
                'header' => 'brand',
                'accessor' => 'brand',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'model',
                'accessor' => 'model',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'maintenance_notes',
                'accessor' => 'maintenance_notes',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|string',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
            [
                'header' => 'service_info',
                'accessor' => 'service_info',
                'visibility' => false,
                'type' => 'string',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'calibration_required',
                'accessor' => 'calibration_required',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'calibration_history',
                'accessor' => 'calibration_history',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|array',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'calibration_required,true',
                'width' => 2
            ],
            [
                'header' => 'location_type',
                'accessor' => 'location_type',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Room', 'Floor', 'Building', 'Land'],
                'validation' => 'required|in:Room,Floor,Building,Land',
                'context' => ['edit', 'create'],
            ],
            [
                'header' => 'location',
                'accessor' => 'location_id',
                'visibility' => false,
                'type' => 'link',
                'search_url' => route('educational-materials.location'),
                'validation' => 'required|integer',
                'context' => ['edit', 'create'],
                'depends_on' => 'location_type',
            ],
            [
                'header' => 'location_type',
                'accessor' => 'location_type',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required',
                'context' => ['show'],
            ],
            [
                'header' => 'technical_specifications',
                'accessor' => 'technical_specifications',
                'visibility' => false,
                'type' => 'json_counter_list',
                'option' => [
                    'Dimensions',
                    'Weight',
                    'Material',
                    'Color',
                    'Capacity',
                    'Features',
                    'Safety Features',
                    'Age Range',
                    'Subject Area'
                ],
                'validation' => 'nullable|array',
                'context' => ['show', 'edit', 'create'],
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('EducationalMaterials/Index', [
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

        return Inertia::render('EducationalMaterials/Create', ['fields' => $fields]);
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

        $educationalMaterial = EducationalMaterial::create([
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
            'technical_specifications' => $data['technical_specifications'] ?? [],
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
            'calibration_history' => $data['calibration_history'] ?? [],
            'location_type' => $locationType,
            'location_id' => $data['location_id'],
        ]);

        $educationalMaterial->handleFileUploads($request);
        $this->createBarcodeForEducationalMaterial($educationalMaterial);

        return redirect()->route('educational-materials.index')->with('success', 'Educational Material created successfully.');
    }

    public function show($id)
    {
        $educationalMaterial = EducationalMaterial::with(['location', 'warrantyCerts', 'assetPhotos', 'barcode'])->where('educational_material_id', $id)->firstOrFail();

        $barcodeUrl = $educationalMaterial->barcode && $educationalMaterial->barcode->barcode_image_path
            ? url('storage/' . $educationalMaterial->barcode->barcode_image_path)
            : null;

        return response()->json([
            'record' => array_merge($educationalMaterial->toArray(), [
                'barcode_url' => $barcodeUrl,
            ]),
        ]);
    }

    public function edit($id)
    {
        $educationalMaterial = EducationalMaterial::with(['warrantyCerts', 'assetPhotos'])->findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $fields = array_map(function ($column) use ($educationalMaterial) {
            $default = $educationalMaterial ? ($educationalMaterial[$column['accessor']] ?? null) : null;

            // Handle JSON fields
            if ($educationalMaterial) {
                switch ($column['accessor']) {
                    case 'location_type':
                        $default = class_basename($educationalMaterial->location_type);
                        break;
                    case 'warranty_cert':
                        $default = $educationalMaterial->warrantyCerts ? $educationalMaterial->warrantyCerts->map(function ($file) {
                            return url('storage/' . $file->file_path);
                        })->toArray() : [];
                        break;
                    case 'asset_photo':
                        $default = $educationalMaterial->assetPhotos ? $educationalMaterial->assetPhotos->map(function ($file) {
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

        return Inertia::render('EducationalMaterials/Edit', [
            'fields' => $fields,
            'educationalMaterial' => $educationalMaterial,
        ]);
    }

    public function update(Request $request, $id)
    {
        $educationalMaterial = EducationalMaterial::findOrFail($id);
        $rules = [];

        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context'])) {
                $rule = $col['validation'];
                if (str_contains($rule, 'unique:educational_materials,asset_code')) {
                    $rule = str_replace(
                        'unique:educational_materials,asset_code',
                        'unique:educational_materials,asset_code,' . $educationalMaterial->educational_material_id . ',educational_material_id',
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

        $educationalMaterial->update([
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
            'technical_specifications' => $data['technical_specifications'] ?? [],
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
            'calibration_history' => $data['calibration_history'] ?? [],
            'location_type' => $locationType,
            'location_id' => $data['location_id'],
        ]);

        $educationalMaterial->handleFileUploads($request);
        $this->refreshBarcodeForEducationalMaterialIfNeeded($educationalMaterial);

        return redirect()->route('educational-materials.index')->with('success', 'Educational Material updated successfully.');
    }

    public function destroy($id)
    {
        EducationalMaterial::findOrFail($id)->delete();
        return redirect()->route('educational-materials.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = EducationalMaterial::with('location');
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
        return $this->exportService->export($request, 'educational_material_id', EducationalMaterial::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'educational_material_id', EducationalMaterial::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(EducationalMaterial::class, $id, $request, ['educational_material_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, EducationalMaterial::class, 'educational_material_id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, EducationalMaterial::class, 'educational_material_id');
    }

    public function search($search = null)
    {
        $query = EducationalMaterial::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('asset_code', 'like', "%{$search}%")
                    ->orWhere('tmv_code', 'like', "%{$search}%")
                    ->orWhere('subgroup', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%");
            });
        }

        $results = $query->limit(10)->get(['educational_material_id', 'asset_code', 'tmv_code', 'subgroup', 'brand', 'model']);

        return response()->json($results);
    }
}
