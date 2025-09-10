<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\Floor;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasFileUploads;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasFileUploads;

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
        $this->exportService = $exportService;
        $this->activityLogRepository = $activityLogRepository;
        $this->filterRepository = $filterRepository;
    }

    protected function getColumns()
    {
        return [
            [
                'header' => 'room_code',
                'accessor' => 'room_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:rooms,room_code',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'room_type',
                'accessor' => 'room_type',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Classroom', 'Science Laboratory', 'Turbine', 'Conference'],
                'validation' => 'required|in:Classroom,Science Laboratory,Turbine,Conference',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'size',
                'accessor' => 'size',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'width',
                'accessor' => 'width',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'has_door',
                'accessor' => 'has_door',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
            [
                'header' => 'door_material',
                'accessor' => 'door_material',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Wood', 'PVC', 'Aluminum'],
                'validation' => 'nullable|in:Wood,PVC,Aluminum',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'door_wingspan_cm',
                'accessor' => 'door_wingspan_cm',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'observation_window_type',
                'accessor' => 'observation_window_type',
                'visibility' => false,
                'type' => 'select',
                'option' => ['None', 'Tampered', 'Non-Tampered'],
                'validation' => 'nullable|in:None,Tampered,Non-Tampered',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'has_door_threshold',
                'accessor' => 'has_door_threshold',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'has_door_shin_guard',
                'accessor' => 'has_door_shin_guard',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'has_door_centre_back',
                'accessor' => 'has_door_centre_back',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_door,true',
            ],
            [
                'header' => 'has_window',
                'accessor' => 'has_window',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
            [
                'header' => 'window_total_area',
                'accessor' => 'window_total_area',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_window,true',
            ],
            [
                'header' => 'window_starting_height',
                'accessor' => 'window_starting_height',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|numeric',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_window,true',
            ],
            [
                'header' => 'window_opening_type',
                'accessor' => 'window_opening_type',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Vasisdas', 'Sideways', 'Upwards'],
                'validation' => 'nullable|in:Vasisdas,Sideways,Upwards',
                'context' => ['show', 'edit', 'create'],
                'required_if' => 'has_window,true',
            ],
            [
                'header' => 'has_fire_escape',
                'accessor' => 'has_fire_escape',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'has_elevator',
                'accessor' => 'has_elevator',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'flooring',
                'accessor' => 'flooring',
                'visibility' => true,
                'type' => 'select',
                'option' => ['PVC', 'Laminate', 'Carpet', 'Ceramic-Tiles', 'Wood', 'Rubber'],
                'validation' => 'nullable|in:PVC,Laminate,Carpet,Ceramic-Tiles,Wood,Rubber',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'daylight_direction',
                'accessor' => 'daylight_direction',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Left', 'Right', 'Back', 'Front', 'Mixed'],
                'validation' => 'nullable|in:Left,Right,Back,Front,Mixed',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'ventilation',
                'accessor' => 'ventilation',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'lighting',
                'accessor' => 'lighting',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'sound_insulation',
                'accessor' => 'sound_insulation',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'paint_condition',
                'accessor' => 'paint_condition',
                'visibility' => false,
                'type' => 'select',
                'option' => ['Sufficient', 'Insufficient'],
                'validation' => 'nullable|in:Sufficient,Insufficient',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'number_of_sockets',
                'accessor' => 'number_of_sockets',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'nullable|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'data_outputs',
                'accessor' => 'data_outputs',
                'visibility' => false,
                'type' => 'json_counter_list',
                'option' => [
                    'Cat 6',
                    'Cat 5',
                    'Multi-mode Fiber',
                    'Single-mode Fiber',
                ],
                'validation' => 'nullable|array',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'heating',
                'accessor' => 'heating',
                'visibility' => false,
                'type' => 'select',
                'option' => ['None', 'Heating', 'Air Conditioning'],
                'validation' => 'nullable|in:None,Heating,Air Conditioning',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'has_clean_water',
                'accessor' => 'has_clean_water',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'has_dirty_water',
                'accessor' => 'has_dirty_water',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'has_natural_gas',
                'accessor' => 'has_natural_gas',
                'visibility' => false,
                'type' => 'boolean',
                'validation' => 'boolean',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'seats',
                'accessor' => 'seats',
                'visibility' => true,
                'type' => 'number',
                'validation' => 'nullable|integer',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'floor',
                'accessor' => 'floor.floor_id',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|exists:floors,floor_id',
                'context' => ['show'],
            ],
            [
                'header' => 'floor',
                'accessor' => 'floor_id',
                'visibility' => false,
                'type' => 'link',
                'validation' => 'required|exists:floors,floor_id',
                'search_url' => route('floors.search'),
                'context' => ['edit', 'create'],
            ],
            [
                'header' => 'photos',
                'accessor' => 'room_photos',
                'visibility' => false,
                'type' => 'file',
                'validation' => 'nullable',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
            [
                'header' => 'notes',
                'accessor' => 'notes',
                'visibility' => false,
                'type' => 'text',
                'validation' => 'nullable|string',
                'context' => ['show', 'edit', 'create'],
                'width' => 2
            ],
        ];
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

        $room = Room::create([
            'room_code' => $data['room_code'],
            'room_type' => $data['room_type'],
            'size' => $data['size'],
            'width' => $data['width'],
            'has_door' => $data['has_door'],
            'door_material' => $data['door_material'],
            'door_wingspan_cm' => $data['door_wingspan_cm'],
            'observation_window_type' => $data['observation_window_type'],
            'has_door_threshold' => $data['has_door_threshold'],
            'has_door_shin_guard' => $data['has_door_shin_guard'],
            'has_door_centre_back' => $data['has_door_centre_back'],
            'has_window' => $data['has_window'],
            'window_total_area' => $data['window_total_area'],
            'window_starting_height' => $data['window_starting_height'],
            'window_opening_type' => $data['window_opening_type'],
            'has_fire_escape' => $data['has_fire_escape'],
            'has_elevator' => $data['has_elevator'],
            'flooring' => $data['flooring'],
            'daylight_direction' => $data['daylight_direction'],
            'ventilation' => $data['ventilation'],
            'lighting' => $data['lighting'],
            'sound_insulation' => $data['sound_insulation'],
            'paint_condition' => $data['paint_condition'],
            'number_of_sockets' => $data['number_of_sockets'],
            'data_outputs' => json_encode($data['data_outputs']),
            'heating' => $data['heating'],
            'has_clean_water' => $data['has_clean_water'],
            'has_dirty_water' => $data['has_dirty_water'],
            'has_natural_gas' => $data['has_natural_gas'],
            'seats' => $data['seats'],
            'floor_id' => $data['floor_id'],
            'notes' => $data['notes'] ?? null,
        ]);

        $room->handleFileUploads($request);

        return redirect()->route('rooms.index')->with('success', 'Room created successfully.');
    }

    public function show($id)
    {
        $room = Room::with('floor.building', 'roomPhotos')->where('room_id', $id)->firstOrFail();

        return response()->json(['record' => $room]);
    }

    public function edit($id)
    {
        $room = Room::findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $fields = array_map(function ($column) use ($room) {
            $default = $room ? ($room[$column['accessor']] ?? null) : null;

            // Handle file fields to provide URLs from relationships
            if ($room) {
                switch ($column['accessor']) {
                    case 'data_outputs':
                        $default = $room->data_outputs ? json_decode($room->data_outputs, true) : [];
                        break;
                    case 'room_photos':
                        $default = $room->roomPhotos ? $room->roomPhotos->map(function ($file) {
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
                    $rule = str_replace(
                        'unique:rooms,room_code',
                        'unique:rooms,room_code,' . $room->room_id . ',room_id',
                        $rule
                    );;
                }
                $rules[$col['accessor']] = $rule;
            }
        }

        $data = $request->validate($rules);

        $room->update([
            'room_code' => $data['room_code'],
            'room_type' => $data['room_type'],
            'size' => $data['size'],
            'width' => $data['width'],
            'has_door' => $data['has_door'],
            'door_material' => $data['door_material'],
            'door_wingspan_cm' => $data['door_wingspan_cm'],
            'observation_window_type' => $data['observation_window_type'],
            'has_door_threshold' => $data['has_door_threshold'],
            'has_door_shin_guard' => $data['has_door_shin_guard'],
            'has_door_centre_back' => $data['has_door_centre_back'],
            'has_window' => $data['has_window'],
            'window_total_area' => $data['window_total_area'],
            'window_starting_height' => $data['window_starting_height'],
            'window_opening_type' => $data['window_opening_type'],
            'has_fire_escape' => $data['has_fire_escape'],
            'has_elevator' => $data['has_elevator'],
            'flooring' => $data['flooring'],
            'daylight_direction' => $data['daylight_direction'],
            'ventilation' => $data['ventilation'],
            'lighting' => $data['lighting'],
            'sound_insulation' => $data['sound_insulation'],
            'paint_condition' => $data['paint_condition'],
            'number_of_sockets' => $data['number_of_sockets'],
            'data_outputs' => json_encode($data['data_outputs']),
            'heating' => $data['heating'],
            'has_clean_water' => $data['has_clean_water'],
            'has_dirty_water' => $data['has_dirty_water'],
            'has_natural_gas' => $data['has_natural_gas'],
            'seats' => $data['seats'],
            'floor_id' => $data['floor_id'],
            'notes' => $data['notes'] ?? null,
        ]);

        $room->handleFileUploads($request);

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
