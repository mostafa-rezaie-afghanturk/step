<?php

namespace App\Helpers;

use Illuminate\Support\Facades\DB;

class DataValidationHelper
{
    /**
     * Validate if the provided value is a valid enum for the specified column.
     *
     * @param  string  $table
     * @param  string  $field
     * @param  mixed  $value
     * @return bool|array
     */
    public static function isValidEnumValue($table, $field, $value)
    {
        // Ensure the table and field names are safe to use
        $table = preg_replace('/[^a-zA-Z0-9_]+/', '', $table); // Remove any unsafe characters
        $field = preg_replace('/[^a-zA-Z0-9_]+/', '', $field); // Remove any unsafe characters

        // Safely construct your query
        $enumValues = DB::select("SHOW COLUMNS FROM `$table` WHERE Field = ?", [$field]);

        if (isset($enumValues[0]->Type)) {
            // Extract the enum values from the Type field
            preg_match('/^enum\((.*)\)$/', $enumValues[0]->Type, $matches);
            $enumArray = [];

            if (isset($matches[1])) {
                // Split the enum values by commas and trim any quotes
                $enumArray = array_map(function ($item) {
                    return trim($item, "'");
                }, explode(',', $matches[1]));
            }

            // Check if the value exists in the enum values
            if (! in_array($value, $enumArray)) {
                return $enumArray; // Return valid enum values
            }

            return true; // Value is valid
        }

        return false; // Not an enum type
    }

    // Helper function to check if the value is valid for the column type
    public static function isValidValueForColumn($columnType, $value, $table, $field)
    {
        switch ($columnType) {
            case 'integer':
            case 'bigint':
            case 'smallint':
                return is_numeric($value) ? true : false;
            case 'string':
            case 'text':
                return is_string($value) ? true : false;
            case 'boolean':
                return is_bool($value) || in_array($value, [0, 1, '0', '1'], true) ? true : false;
            case 'date':
            case 'datetime':
            case 'timestamp':
                return (bool) strtotime($value); // Checks if the value is a valid date
            case 'enum':
                return self::isValidEnumValue($table, $field, $value);
            default:
                return true; // Other types can have custom handling if needed
        }
    }
    // Add other utility functions here as needed
}
