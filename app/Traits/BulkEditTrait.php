<?php

namespace App\Traits;

use App\Helpers\DataValidationHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

trait BulkEditTrait
{
    public function bulkEditMulti(Request $request, $modelClass, $modal_id)
    {
        // Validate the request
        $validated = $request->validate([
            'ids' => 'required|array',
            'field' => 'required|string',
            'value' => 'required',
        ]);

        // Initialize the model
        $model = new $modelClass;
        $table = $model->getTable();

        // Check if the field is fillable
        if (! in_array($validated['field'], $model->getFillable())) {
            return response()->json([
                'message' => "The selected field '{$validated['field']}' cannot be updated. Allowed fields are: ".implode(', ', $model->getFillable()),
            ], 400);
        }

        // Check if the field exists in the database
        if (! Schema::hasColumn($table, $validated['field'])) {
            return response()->json([
                'message' => "The selected field '{$validated['field']}' does not exist in the '{$table}' table.",
            ], 400);
        }

        // Validate each row before performing updates
        foreach ($validated['ids'] as $id) {
            $record = $modelClass::find($id);
            if (! $record) {
                return response()->json(['message' => "{$modelClass} record with ID {$id} not found."], 404);
            }
        }

        // Get the field type
        $columnType = Schema::getColumnType($table, $validated['field']);

        // Perform a check based on the column type (using a hypothetical helper class)
        if (! DataValidationHelper::isValidValueForColumn($columnType, $validated['value'], $table, $validated['field'])) {
            $errorMessage = "The value '{$validated['value']}' is not valid for the field '{$validated['field']}'.";

            if ($columnType === 'enum') {
                $enumValues = DataValidationHelper::isValidEnumValue($table, $validated['field'], $validated['value']);
                $errorMessage .= ' Please use one of the valid enum values: '.implode(', ', $enumValues).'.';
            }

            return response()->json(['message' => $errorMessage], 400);
        }

        // Perform the bulk update
        $updatedCount = $modelClass::whereIn($modal_id, $validated['ids'])->update([
            $validated['field'] => $validated['value'],
        ]);

        if ($updatedCount === 0) {
            return response()->json(['message' => 'No matching records found to update for the provided IDs.'], 404);
        }

        // Return a successful response
        return response()->json(['message' => 'Records updated successfully.', 'updated_count' => $updatedCount]);

        // $validated = $request->validate([
        //     'ids' => 'required|array',
        //     'field' => 'required|string',
        //     'value' => 'required',
        // ]);

        // // Get the model and the table name
        // $model = new $modelClass;
        // $table = $model->getTable();

        // // Check if the field is fillable
        // if (! in_array($validated['field'], $model->getFillable())) {
        //     return response()->json([
        //         'message' => "The selected field '{$validated['field']}' cannot be updated. Allowed fields are: " . implode(', ', $model->getFillable()),
        //     ], 400);
        // }

        // // Check if the field exists in the database
        // if (! Schema::hasColumn($table, $validated['field'])) {
        //     return response()->json([
        //         'message' => "The selected field '{$validated['field']}' does not exist in the '{$table}' table.",
        //     ], 400);
        // }

        // // Validate each row before performing updates
        // foreach ($validated['ids'] as $id) {
        //     // Retrieve the current library record
        //     $borrower = $modelClass::find($id);
        //     if (! $borrower) {
        //         return response()->json(['message' => "Record with ID {$id} not found."], 404);
        //     }
        // }

        // // Get the field type
        // $columnType = Schema::getColumnType($table, $validated['field']);

        // // Perform a check based on the column type
        // $isValid = DataValidationHelper::isValidValueForColumn($columnType, $validated['value'], $table, $validated['field']);
        // if ($isValid !== true) {
        //     $errorMessage = "The value '{$validated['value']}' is not valid for the field '{$validated['field']}'.";

        //     // If the column type is enum, specify allowed values
        //     if ($columnType === 'enum') {
        //         $enumValues = DataValidationHelper::isValidEnumValue($table, $validated['field'], $validated['value']);
        //         $errorMessage .= ' Please use one of the valid enum values: ' . implode(', ', $enumValues) . '.';
        //     }

        //     return response()->json(['message' => $errorMessage], 400);
        // }

        // // Perform the bulk update
        // $updatedCount = $modelClass::whereIn($modal_id, $validated['ids'])->update([
        //     $validated['field'] => $validated['value'],
        // ]);

        // if ($updatedCount === 0) {
        //     return response()->json(['message' => 'No matching records found to update for the provided IDs.'], 404);
        // }

        // // Return a successful response
        // return response()->json(['message' => 'Records updated successfully.', 'updated_count' => $updatedCount]);
    }
}
