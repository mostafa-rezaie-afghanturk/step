<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Repositories\FilterRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ActivityLogsController extends Controller
{
    protected $filterRepository;
    private $columns;
    public $searchColumns = ['log_name', 'event', 'causer.name', 'created_at'];

    public function __construct(FilterRepository $filterRepository,)
    {
        $this->columns = $this->getColumns();
        $this->filterRepository = $filterRepository;
    }

    protected function getColumns()
    {
        $columns = [
            [
                'header' => 'id',
                'accessor' => 'id',
                'visibility' => true,
                'type' => 'string',
                'context' => ['show'],
            ],
            [
                'header' => 'log_name',
                'accessor' => 'log_name',
                'visibility' => true,
                'type' => 'string',
                'context' => ['show'],
            ],
            [
                'header' => 'event',
                'accessor' => 'event',
                'visibility' => true,
                'type' => 'string',
                'context' => ['show'],
            ],
            [
                'header' => 'causer_name',
                'accessor' => 'causer.name',
                'visibility' => true,
                'type' => 'string',
                'context' => ['show'],
            ],
            [
                'header' => 'created_at',
                'accessor' => 'created_at',
                'visibility' => true,
                'type' => 'string',
                'context' => ['show'],
            ],
        ];

        return $columns;
    }

    public function index()
    {
        return Inertia::render('ActivityLogs/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function datatable(Request $request)
    {
        $query = ActivityLog::with('causer', 'subject')
            ->orderBy('created_at', 'desc');

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

    public function show(string $id)
    {
        $activityLog = ActivityLog::with(['causer', 'subject'])->findOrFail($id);

        return response()->json([
            'records' => [$activityLog],
        ]);
    }
}
