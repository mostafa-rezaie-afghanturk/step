<?php

namespace App\Repositories;

use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\Activitylog\Models\Activity;

class ActivityLogRepository
{
    /**
     * Get paginated activity logs for a given model and ID.
     */
    public function getLogs(string $modelClass, int $id, Request $request, array $filterableFields = []): array
    {
        try {
            $logs = Activity::query();

            $logs->where(['subject_type' => $modelClass, 'subject_id' => $id])
                ->with(['causer' => function ($query) {
                    $query->select('id', 'email', 'name');
                }]);

            // Apply filters using a repository method or closure
            $data = app()->make('App\Repositories\FilterRepository')->applyFilters($logs, $request, $filterableFields);

            return $this->formatResponse($data);
        } catch (\Throwable $th) {
            throw $th; // Handle or log exceptions as needed
        }
    }

    /**
     * Format the paginated response.
     */
    protected function formatResponse(LengthAwarePaginator $data): array
    {
        return [
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
        ];
    }
}
