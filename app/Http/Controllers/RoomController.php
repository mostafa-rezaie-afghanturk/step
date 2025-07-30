<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Floor;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait;

    protected $columns;
    protected $fields;
    protected $exportService;
    protected $activityLogRepository;
    protected $filterRepository;

    public $searchColumns = ['room_code', 'room_type', 'floor.floor_code'];

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
                'header' => 'Room Code',
                'accessor' => 'room_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:rooms,room_code',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Room Type',
                'accessor' => 'room_type',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Classroom', 'Science Laboratory', 'Turbine', 'Conference'],
                'validation' => 'required|in:Classroom,Science Laboratory,Turbine,Conference',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Size',
                'accessor' => 'size',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Width',
                'accessor' => 'width',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Has Door',
                'accessor' => 'has_door',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'nullable|boolean',
                'context' => ['show', 'edit', 'create'],
                 'width' => 2
            ],
            [
                'header' => 'Door Material',
                'accessor' => 'door_material',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Wood', 'PVC', 'Aluminum'],
                'validation' => 'nullable|in:Wood,PVC,Aluminum',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'Door Wingspan (cm)',
                'accessor' => 'door_wingspan_cm',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'Observation Window Type',
                'accessor' => 'observation_window_type',
                'visibility' => false,
                'type' => 'select',
                'option' => ['None', 'Tampered', 'Non-Tampered'],
                'validation' => 'nullable|in:None,Tampered,Non-Tampered',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'Has Door Threshold',
                'accessor' => 'has_door_threshold',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'Has Door Shin Guard',
                'accessor' => 'has_door_shin_guard',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'Has Door Centre Back',
                'accessor' => 'has_door_centre_back',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'Has Window',
                'accessor' => 'has_window',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'nullable|boolean',
                'context' => ['show', 'edit', 'create'],
                 'width' => 2
            ],
            [
                'header' => 'Window Total Area',
                'accessor' => 'window_total_area',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_window,true',
            ],
            [
                'header' => 'Window Starting Height',
                'accessor' => 'window_starting_height',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_window,true',
            ],
            [
                'header' => 'Window Opening Type',
                'accessor' => 'window_opening_type',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Vasisdas', 'Sideways', 'Upwards'],
                'validation' => 'nullable|in:Vasisdas,Sideways,Upwards',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_window,true',
            ],
            [
                'header' => 'Has Fire Escape',
                'accessor' => 'has_fire_escape',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Has Elevator',
                'accessor' => 'has_elevator',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Flooring',
                'accessor' => 'flooring',
                'visibility' => true,
                'type' => 'select',
                'option' => ['PVC', 'Laminate', 'Carpet', 'Ceramic-Tiles', 'Wood', 'Rubber'],
                'validation' => 'nullable|in:PVC,Laminate,Carpet,Ceramic-Tiles,Wood,Rubber',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Daylight Direction',
                'accessor' => 'daylight_direction',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Left', 'Right', 'Back', 'Front', 'Mixed'],
                'validation' => 'nullable|in:Left,Right,Back,Front,Mixed',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Ventilation',
                'accessor' => 'ventilation',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Lighting',
                'accessor' => 'lighting',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Sound Insulation',
                'accessor' => 'sound_insulation',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Paint Condition',
                'accessor' => 'paint_condition',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Sockets',
                'accessor' => 'number_of_sockets',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Data Outputs',
                'accessor' => 'data_outputs',
                'visibility' => false,
                'type' => 'json_counter_list',
                'option' => [
                    'Cat 6',
                    'Cat 5',
                    'Multi-mode Fiber',
                    'Single-mode Fiber',
                ],
                'validation' => 'nullable|json',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Heating',
                'accessor' => 'heating',
                'visibility' => false,
                'type' => 'select',
                'option' => ['None', 'Heating', 'Air Conditioning'],
                'validation' => 'nullable|in:None,Heating,Air Conditioning',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Clean Water',
                'accessor' => 'has_clean_water',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Dirty Water',
                'accessor' => 'has_dirty_water',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Natural Gas',
                'accessor' => 'has_natural_gas',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Seats',
                'accessor' => 'seats',
                'visibility' => true,
                'type' => 'number',
                'validation' => 'nullable|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'Floor',
                'accessor' => 'floor.floor_id',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|exists:floors,floor_id',
                'context' => ['show'],
            ],
            [
                'header' => 'Floor',
                'accessor' => 'floor_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|exists:floors,floor_id',
                'search_url' => route('floors.search'),
                'context' => ['edit', 'create'],
            ],
            [
                'header' => 'Photos',
                'accessor' => 'room_photo',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable|string|max:255',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
            [
                'header' => 'Notes',
                'accessor' => 'notes',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|string',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
        ];
    }

    protected function getFields($room = null)
    {
        return array_map(function ($column) use ($room) {
            return [
                'name' => $column['accessor'],
                'label' => $column['header'],
                'type' => $column['type'],
                'option' => $column['option'] ?? null,
                'default' => $room ? data_get($room, $column['accessor']) : null,
                'search_url' => $column['search_url'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];
        }, $this->columns);
    }

    public function index()
    {
        return Inertia::render('Rooms/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function create($id = null)
    {
        $floor = $id ? Floor::findOrFail($id) : null;

        $editableColumns = array_filter($this->getColumns(), fn($col) => in_array('create', $col['context']));

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
                'required_if' => $column['required_if'] ?? null,
            ];

            return $field;
        }, $editableColumns);

        $fields = array_values($fields);

        return Inertia::render('Rooms/Create', ['fields' => $fields]);
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
        Room::create($data);

        return redirect()->route('rooms.index')->with('success', 'Room created successfully.');
    }

    public function show($id)
    {
        $room = Room::with('floor.building')->where('room_id', $id)->firstOrFail();
        return response()->json(['record' => $room]);
    }

    public function edit($id)
    {
        $room = Room::findOrFail($id);
        $fields = $this->getFields($room);

        return Inertia::render('Rooms/Edit', [
            'fields' => $fields,
            'room' => $room,
        ]);
    }

    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);
        $rules = [];
        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context'])) {
                $rule = $col['validation'];
                if (str_contains($rule, 'unique:rooms,room_code')) {
                    $rule = str_replace('unique:rooms,room_code', 'unique:rooms,room_code,' . $room->id, $rule);
                }
                $rules[$col['accessor']] = $rule;
            }
        }

        $data = $request->validate($rules);
        $room->update($data);

        return redirect()->route('rooms.index')->with('success', 'Room updated successfully.');
    }

    public function destroy($id)
    {
        Room::findOrFail($id)->delete();
        return redirect()->route('rooms.index')->with('success', 'Deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = Room::with('floor');
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
        return $this->exportService->export($request, 'room_id', Room::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'room_id', Room::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(Room::class, $id, $request, ['room_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Room::class, 'room_id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Room::class, 'room_id');
    }
}
