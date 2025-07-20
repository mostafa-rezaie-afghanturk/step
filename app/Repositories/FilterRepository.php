<?php

// namespace App\Repositories;

// use Illuminate\Database\Eloquent\Builder;
// use Illuminate\Http\Request;

// class FilterRepository
// {
//     public function applyFilters(Builder $query, Request $request)
//     {
//         $filters = json_decode($request->input('filters'), true);

//         foreach ($filters as $filter) {
//             $field = $filter['field'];
//             $condition = $filter['condition'];
//             $value = $filter['value'];

//             if ($field && $condition && $value) {
//                 if (str_contains($field, '.')) {
//                     [$relation, $field] = explode('.', $field);
//                     $query->whereHas($relation, function ($q) use ($field, $condition, $value) {
//                         $this->applyCondition($q, $field, $condition, $value);
//                     });
//                 } else {
//                     $this->applyCondition($query, $field, $condition, $value);
//                 }
//             }
//         }

//         // Handle sorting
//         if ($request->sort_column && $request->sort_direction) {
//             $query->orderBy($request->sort_column, $request->sort_direction);
//         }

//         // Return paginated data
//         return $query->paginate($request->page_size ?? 10);
//     }

//     private function applyCondition(Builder $query, string $field, string $condition, $value)
//     {
//         switch ($condition) {
//             case '=':
//                 $query->where($field, '=', $value);
//                 break;
//             case '!=':
//                 $query->where($field, '!=', $value);
//                 break;
//             case 'like':
//                 $query->where($field, 'like', "%$value%");
//                 break;
//             case 'in':
//                 $query->whereIn($field, explode(',', $value));
//                 break;
//             case 'not in':
//                 $query->whereNotIn($field, explode(',', $value));
//                 break;
//             default:
//                 // Handle other conditions or fallback
//                 break;
//         }
//     }
// }

// namespace App\Repositories;

// use Illuminate\Database\Eloquent\Builder;
// use Illuminate\Http\Request;

// class FilterRepository
// {
//     public function applyFilters(Builder $query, Request $request , $searchColumns  )
//     {

//         // Apply filters
//         $filters = json_decode($request->input('filters'), true);
//         foreach ($filters as $filter) {
//             $field = $filter['field'];
//             $condition = $filter['condition'];
//             $value = $filter['value'];

//             if ($field && $condition && $value) {
//                 if (str_contains($field, '.')) {
//                     [$relation, $field] = explode('.', $field);
//                     $query->whereHas($relation, function ($q) use ($field, $condition, $value) {
//                         $this->applyCondition($q, $field, $condition, $value);
//                     });
//                 } else {
//                     $this->applyCondition($query, $field, $condition, $value);
//                 }
//             }
//         }

//         // Apply search
//         if ($searchTerm = $request->input('search')) {
//             $this->applySearch($query, $searchColumns, $searchTerm);
//         }

//         // Handle sorting
//         if ($request->sort_column && $request->sort_direction) {
//             $query->orderBy($request->sort_column, $request->sort_direction);
//         }

//         // Return paginated data
//         return $query->paginate($request->page_size ?? 10);
//     }

//     private function applyCondition(Builder $query, string $field, string $condition, $value)
//     {
//         switch ($condition) {
//             case '=':
//                 $query->where($field, '=', $value);
//                 break;
//             case '!=':
//                 $query->where($field, '!=', $value);
//                 break;
//             case 'like':
//                 $query->where($field, 'like', "%$value%");
//                 break;
//             case 'in':
//                 $query->whereIn($field, explode(',', $value));
//                 break;
//             case 'not in':
//                 $query->whereNotIn($field, explode(',', $value));
//                 break;
//             default:
//                 // Handle other conditions or fallback
//                 break;
//         }
//     }

//     private function applySearch(Builder $query, array $fields, string $searchTerm)
//     {
//         $query->where(function ($query) use ($fields, $searchTerm) {
//             foreach ($fields as $field) {
//                 if (str_contains($field, '.')) {
//                     // Handle the relation search
//                     $this->applyRelationSearch($query, $field, $searchTerm);
//                 } else {
//                     // Handle the field search for the main model
//                     $query->orWhere($field, 'like', "%$searchTerm%");
//                 }
//             }
//         });
//     }

//     // Function to handle relation search
//     private function applyRelationSearch(Builder $query, string $field, string $searchTerm)
//     {
//         // Split the field to get the relation and the actual field in the related model
//         $segments = explode('.', $field);
//         $relation = array_shift($segments); // Get the first part as the relation
//         $relatedField = implode('.', $segments); // Combine the remaining parts as the field

//         // Apply the search to the related model
//         $query->orWhereHas($relation, function ($q) use ($relatedField, $searchTerm) {
//             $q->where($relatedField, 'like', "%$searchTerm%");
//         });
//     }
// }

namespace App\Repositories;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class FilterRepository
{
    public function applyFilters(Builder $query, Request $request, $searchColumns)
    {
        $filters = json_decode($request->input('filters'), true);
        $searchTerm = $request->input('search');
        $exactMatch = json_decode($request->input('exact_match'), false);
        if ($searchTerm) {
            $this->applySearch($query, $searchColumns, $searchTerm, $exactMatch);
        }

        foreach ($filters as $filter) {
            $field = $filter['field'];
            $condition = $filter['condition'];
            $value = $filter['value'];

            if ($field && $condition && $value) {
                if (str_contains($field, '.')) {
                    [$relation, $field] = explode('.', $field);
                    $query->whereHas($relation, function ($q) use ($field, $condition, $value) {
                        $this->applyCondition($q, $field, $condition, $value);
                    });
                } else {
                    $this->applyCondition($query, $field, $condition, $value);
                }
            }
        }

        if ($request->sort_column && $request->sort_direction) {
            $query->orderBy($request->sort_column, $request->sort_direction);
        }

        return $query->paginate($request->page_size ?? 10);
    }

    private function applyCondition(Builder $query, string $field, string $condition, $value)
    {
        switch ($condition) {
            case '=':
                $query->where($field, '=', $value);
                break;
            case '!=':
                $query->where($field, '!=', $value);
                break;
            case 'like':
                $query->where($field, 'like', "%$value%");
                break;
            case 'in':
                $query->whereIn($field, explode(',', $value));
                break;
            case 'not in':
                $query->whereNotIn($field, explode(',', $value));
                break;
            default:
                break;
        }
    }

    private function applySearch(Builder $query, array $fields, string $searchTerm, bool $exactMatch = false)
    {
        $query->where(function ($query) use ($fields, $searchTerm, $exactMatch) {
            foreach ($fields as $field) {
                if (str_contains($field, '.')) {
                    $this->applyRelationSearch($query, $field, $searchTerm, $exactMatch);
                } else {
                    $this->applyFieldSearch($query, $field, $searchTerm, $exactMatch);
                }
            }
        });
    }

    // Function to handle relation search
    private function applyRelationSearch(Builder $query, string $field, string $searchTerm, bool $exactMatch)
    {
        $segments = explode('.', $field);
        $relation = array_shift($segments);
        $relatedField = implode('.', $segments);

        $query->orWhereHas($relation, function ($q) use ($relatedField, $searchTerm, $exactMatch) {
            if ($exactMatch) {
                $q->where($relatedField, '=', $searchTerm); // Exact match
            } else {
                $q->where($relatedField, 'like', "%$searchTerm%"); // Like search
            }
        });
    }

    // Function to handle field search for the main model
    private function applyFieldSearch(Builder $query, string $field, string $searchTerm, bool $exactMatch)
    {
        if ($exactMatch) {
            $query->orWhere($field, '=', $searchTerm); // Exact match
        } else {

            $query->orWhere($field, 'like', "%$searchTerm%"); // Like search
        }
    }
}
