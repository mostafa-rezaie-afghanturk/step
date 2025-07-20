<?php

namespace App\Traits;

use Illuminate\Database\QueryException;
use Illuminate\Http\Request;

trait BulkDeleteTrait
{
    public function bulkDeleteMulti(Request $request, $modelClass, $modal_id)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
        ]);
        try {
            $deletedCount = $modelClass::whereIn($modal_id, $validated['ids'])->delete();
            if ($deletedCount === 0) {
                return response()->json(['message' => 'No matching records found to delete for the provided IDs.'], 404);
            }

            return response()->json(['message' => 'Records deleted successfully.', 'deleted_count' => $deletedCount]);
        } catch (QueryException $e) {
            if ($e->getCode() == '23000') {
                return response()->json([
                    'message' => 'Cannot delete some records because they have related child records in other tables.',
                ], 400);
            }

            return response()->json(['message' => 'An error occurred while deleting records.'], 400);
        }
    }
}
