<?php

namespace App\Http\Controllers;

use App\Models\TransferTransaction;
use App\Models\User;
use App\Models\FixtureFurnishing;
use App\Models\EducationalMaterial;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransferController extends Controller
{
    use BulkDeleteTrait, BulkEditTrait, HasDependentDropdowns;

    protected $columns;
    protected $fields;
    protected $exportService;
    protected $activityLogRepository;
    protected $filterRepository;

    public $searchColumns = ['from_user_name', 'to_user_name', 'asset_code', 'return_status', 'transfer_date'];

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
                'accessor' => 'transfer_transaction_id',
                'visibility' => true,
                'type' => 'number',
                'validation' => 'required|integer',
                'context' => ['show'],
            ],
            [
                'header' => 'transfer_date',
                'accessor' => 'transfer_date',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'required|date|before_or_equal:today',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'from_user',
                'accessor' => 'from_user_id',
                'visibility' => true,
                'type' => 'link',
                'search_url' => route('users.search'),
                'validation' => 'required|exists:users,id',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'to_user',
                'accessor' => 'to_user_id',
                'visibility' => true,
                'type' => 'link',
                'search_url' => route('users.search'),
                // 'validation' => 'required|exists:users,id|different:from_user_id',
                'validation' => 'required|exists:users,id',
                'context' => ['show', 'edit', 'create'],
            ],
            [
                'header' => 'asset_type',
                'accessor' => 'asset_or_material_type',
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
                'header' => 'asset_code',
                'accessor' => 'asset_or_material_id',
                'visibility' => true,
                'type' => 'link',
                'search_url' => route('assets.search'),
                'validation' => 'required',
                'context' => ['show', 'edit', 'create'],
                'depends_on' => 'asset_or_material_type',
            ],
            [
                'header' => 'return_status',
                'accessor' => 'return_status',
                'visibility' => true,
                'type' => 'select',
                'option' => ['Transferred', 'Returned'],
                'validation' => 'required|in:Transferred,Returned',
                'context' => ['show', 'edit'],
            ],
            [
                'header' => 'notes',
                'accessor' => 'notes',
                'visibility' => true,
                'type' => 'text',
                'validation' => 'nullable|string|max:1000',
                'context' => ['show', 'edit', 'create'],
                'width' => 2,
            ],
            [
                'header' => 'created_at',
                'accessor' => 'created_at',
                'visibility' => true,
                'type' => 'date',
                'validation' => 'required',
                'context' => ['show'],
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('Transfers/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function assets($search = null)
    {
        $assetType = request()->get('asset_or_material_type');

        $modelClass = $assetType === 'Fixture/Furnishing' ? FixtureFurnishing::class : EducationalMaterial::class;
        $searchField = $assetType === 'Fixture/Furnishing' ? 'fixture_furnishing_id' : 'educational_material_id';

        return $this->handleDependentSearch(
            $modelClass,
            $search,
            null,
            null,
            null,
            'asset_code',
            $searchField,
            function ($asset) {
                $locationCode = $asset->location->room_code ?? $asset->location->floor_code ?? $asset->location->building_code ?? $asset->location->land_code ?? 'Unknown';
                return $locationCode . ' - ' . $asset->asset_code;
            },
            function ($query) {
                $query->with('location');
            }
        );
    }

    public function create($id = null)
    {
        $transfer = $id ? TransferTransaction::findOrFail($id) : null;

        if ($id) {
            $transfer = TransferTransaction::with('fromUser', 'toUser')->where('transfer_transaction_id', $id)->first();
        }

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        // Map the editable columns to the desired format for fields
        $fields = array_map(function ($column) use ($transfer) {

            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $transfer ? ($transfer[$column['accessor']] ?? null) : null,
                'option' => $column['option'] ?? null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];

            return $field; // Return the constructed field/ Return the constructed field
        }, $editableColumns);
        $fields = array_values($fields);

        return Inertia::render('Transfers/Create', [
            'fields' => $fields,
            'transfer' => $transfer,
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

        // Check if asset/material is already transferred
        $existingTransfer = TransferTransaction::where('asset_or_material_type', $data['asset_or_material_type'])
            ->where('asset_or_material_id', $data['asset_or_material_id'])
            ->where('return_status', 'Transferred')
            ->exists();

        if ($existingTransfer) {
            return redirect()->back()->withErrors(['asset_or_material_id' => 'This asset/material is already transferred to someone else.']);
        }

        $transfer = TransferTransaction::create([
            'from_user_id' => $data['from_user_id'],
            'to_user_id' => $data['to_user_id'],
            'asset_or_material_type' => $data['asset_or_material_type'],
            'asset_or_material_id' => $data['asset_or_material_id'],
            'transfer_date' => $data['transfer_date'],
            'notes' => $data['notes'],
            'return_status' => 'Transferred',
        ]);

        return redirect()->route('asset-transfer.index')->with('success', 'Transfer created successfully.');
    }

    public function show($id)
    {
        $transfer = TransferTransaction::with(['fromUser', 'toUser'])->findOrFail($id);

        return response()->json(['record' => $transfer]);
    }

    public function edit($id)
    {
        $transfer = TransferTransaction::findOrFail($id);

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        $fields = array_map(function ($column) use ($transfer) {
            $default = $transfer ? ($transfer[$column['accessor']] ?? null) : null;

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

        return Inertia::render('Transfers/Edit', [
            'fields' => $fields,
            'transfer' => $transfer,
            'users' => User::select('id', 'name', 'email')->get(),
            'fixtures' => FixtureFurnishing::select('fixture_furnishing_id', 'asset_code', 'group', 'subgroup')->get(),
            'materials' => EducationalMaterial::select('educational_material_id', 'asset_code', 'group', 'subgroup')->get(),
        ]);
    }

    public function update(Request $request, $id)
    {
        $transfer = TransferTransaction::findOrFail($id);
        $rules = [];

        foreach ($this->columns as $col) {
            if (in_array('edit', $col['context'])) {
                $rules[$col['accessor']] = $col['validation'];
            }
        }

        $data = $request->validate($rules);

        $transfer->update([
            'from_user_id' => $data['from_user_id'],
            'to_user_id' => $data['to_user_id'],
            'asset_or_material_type' => $data['asset_or_material_type'],
            'asset_or_material_id' => $data['asset_or_material_id'],
            'transfer_date' => $data['transfer_date'],
            'notes' => $data['notes'],
        ]);

        return redirect()->route('asset-transfer.index')->with('success', 'Transfer updated successfully.');
    }

    public function destroy($id)
    {
        TransferTransaction::findOrFail($id)->delete();
        return redirect()->route('asset-transfer.index')->with('success', 'Transfer deleted successfully.');
    }

    public function datatable(Request $request)
    {
        $query = TransferTransaction::with(['fromUser', 'toUser'])
            ->select('transfer_transactions.*')
            ->addSelect([
                'from_user_name' => User::select('name')
                    ->whereColumn('id', 'transfer_transactions.from_user_id')
                    ->limit(1),
                'to_user_name' => User::select('name')
                    ->whereColumn('id', 'transfer_transactions.to_user_id')
                    ->limit(1),
                'asset_type' => DB::raw("
                    CASE
                        WHEN asset_or_material_type = 'App\\\\Models\\\\FixtureFurnishing' THEN 'Fixture/Furnishing'
                        WHEN asset_or_material_type = 'App\\\\Models\\\\EducationalMaterial' THEN 'Educational Material'
                        ELSE 'Unknown'
                    END
                "),
                'asset_code' => DB::raw("
                    CASE
                        WHEN asset_or_material_type = 'App\\\\Models\\\\FixtureFurnishing' THEN
                            (SELECT asset_code FROM fixtures_furnishings WHERE fixture_furnishing_id = asset_or_material_id)
                        WHEN asset_or_material_type = 'App\\\\Models\\\\EducationalMaterial' THEN
                            (SELECT asset_code FROM educational_materials WHERE educational_material_id = asset_or_material_id)
                        ELSE 'Unknown'
                    END
                ")
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
        return $this->exportService->export($request, 'transfer_transaction_id', TransferTransaction::class, $this->columns);
    }

    public function pdf(Request $request)
    {
        return $this->exportService->pdf($request, 'transfer_transaction_id', TransferTransaction::class, $this->columns);
    }

    public function logActivity(Request $request, $id)
    {
        try {
            return response()->json(
                $this->activityLogRepository->getLogs(TransferTransaction::class, $id, $request, ['transfer_transaction_id', 'causer.name', 'event'])
            );
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, TransferTransaction::class, 'transfer_transaction_id');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, TransferTransaction::class, 'transfer_transaction_id');
    }

    public function search($search = null)
    {
        $query = TransferTransaction::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->whereHas('fromUser', function ($userQuery) use ($search) {
                    $userQuery->where('name', 'like', "%{$search}%");
                })
                    ->orWhereHas('toUser', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhere('transfer_date', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");
            });
        }

        $results = $query->with(['fromUser', 'toUser'])
            ->limit(10)
            ->get(['transfer_transaction_id', 'from_user_id', 'to_user_id', 'transfer_date', 'notes']);

        return response()->json($results);
    }

    /**
     * Mark a transferred asset as returned
     */
    public function return(Request $request, $id)
    {
        $transfer = TransferTransaction::findOrFail($id);

        if ($transfer->return_status !== 'Transferred') {
            return redirect()->back()->withErrors(['return_status' => 'This transfer is not in transferred status']);
        }

        $transfer->update(['return_status' => 'Returned']);

        return redirect()->route('asset-transfer.index')->with('success', 'Asset marked as returned successfully');
    }

    /**
     * Get available assets for transfer
     */
    public function getAvailableAssets(Request $request)
    {
        $type = $request->get('type');

        if ($type === 'fixtures') {
            $assets = FixtureFurnishing::select('fixture_furnishing_id', 'asset_code', 'group', 'subgroup')
                ->whereDoesntHave('transferTransactions', function ($query) {
                    $query->where('return_status', 'Transferred');
                })
                ->get();
        } elseif ($type === 'materials') {
            $assets = EducationalMaterial::select('educational_material_id', 'asset_code', 'group', 'subgroup')
                ->whereDoesntHave('transferTransactions', function ($query) {
                    $query->where('return_status', 'Transferred');
                })
                ->get();
        } else {
            $assets = collect();
        }

        return response()->json($assets);
    }

    /**
     * Get asset transfer history
     */
    public function getAssetHistory(Request $request)
    {
        $assetType = $request->get('asset_type');
        $assetId = $request->get('asset_id');

        if (!$assetType || !$assetId) {
            return response()->json(['message' => 'Asset type and ID are required'], 422);
        }

        $transfers = TransferTransaction::where('asset_or_material_type', $assetType)
            ->where('asset_or_material_id', $assetId)
            ->with(['fromUser', 'toUser'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($transfers);
    }
}
