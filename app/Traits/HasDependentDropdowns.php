<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;

trait HasDependentDropdowns
{
    /**
     * Generic method to handle dependent dropdown searches
     */
    // protected function handleDependentSearch(
    //     string $modelClass,
    //     ?string $search,
    //     ?string $dependentId = null,
    //     ?string $dependentField = null,
    //     ?string $relationPath = null,
    //     ?string $labelField = 'name',
    //     ?string $otherField = null,
    //     ?string $valueField = null,
    //     ?callable $labelCallback = null,
    //     ?callable $filterCallback = null
    // ): JsonResponse {
    //     if ($dependentId && ! $dependentField) {
    //         return response()->json([]);
    //     }

    //     /** @var Model $model */
    //     $model = new $modelClass;
    //     $query = $model::query();

    //     // Add relationship constraint if provided
    //     if ($dependentId && $relationPath) {
    //         $query->whereHas($relationPath, function (Builder $query) use ($dependentField, $dependentId) {
    //             $query->where($dependentField, $dependentId);
    //         });
    //     } elseif ($dependentId && $dependentField) {
    //         $query->where($dependentField, $dependentId);
    //     }

    //     // Add search constraint if provided
    //     if ($search) {
    //         $query->where($labelField, 'like', "%$search%");
    //     }

    //     // Apply filter callback if provided
    //     if ($filterCallback) {
    //         $query = $filterCallback($query);
    //     }

    //     $results = $query->orderBy('updated_at', 'desc')
    //         ->limit(20)
    //         ->get();

    //     // Format results
    //     $formattedResults = $results->map(function ($item) use ($labelField, $valueField, $labelCallback) {
    //         $value = $valueField ? $item->{$valueField} : $item->getKey();
    //         $label = $labelCallback ? $labelCallback($item) : $item->{$labelField};

    //         return [
    //             'value' => $value,
    //             'label' => $label,
    //         ];
    //     });

    //     return response()->json($formattedResults);
    // }

    protected function handleDependentSearch(
        string $modelClass,
        ?string $search,
        ?string $dependentId = null,
        ?string $dependentField = null,
        ?string $relationPath = null,
        ?string $labelField = 'name',
        ?string $valueField = null,
        ?callable $labelCallback = null,
        ?callable $filterCallback = null,
        ?string $otherField = null,
        ?int $limit = 20,
    ): JsonResponse {
        if ($dependentId && ! $dependentField) {
            return response()->json([]);
        }

        /** @var Model $model */
        $model = new $modelClass;
        $query = $model::query();

        // Add relationship constraint if provided
        if ($dependentId && $relationPath) {
            $query->whereHas($relationPath, function (Builder $query) use ($dependentField, $dependentId) {
                $query->where($dependentField, $dependentId);
            });
        } elseif ($dependentId && $dependentField) {
            $query->where($dependentField, $dependentId);
        }

        // Add search constraint if provided
        if ($search) {
            $query->where($labelField, 'like', "%$search%");
        }

        // Apply filter callback if provided
        // if ($filterCallback) {
        //     $query = $filterCallback($query);
        // }
        if ($filterCallback) {
            $filterCallback($query); // ← don't reassign
        }

        $results = $query->orderBy('updated_at', 'desc')
            ->limit($limit)
            ->get();

        // Format results
        $formattedResults = $results->map(function ($item) use ($labelField, $valueField, $otherField, $labelCallback) {
            $value = $valueField ? $item->{$valueField} : $item->getKey();
            $label = $labelCallback ? $labelCallback($item) : $item->{$labelField};

            $result = [
                'value' => $value,
                'label' => $label,
            ];

            if ($otherField && isset($item->{$otherField})) {
                $result[$otherField] = $item->{$otherField};
            }

            return $result;
        });

        return response()->json($formattedResults);
    }

}
