<?php

if (!function_exists('urlForFile')) {
    /**
     * Generate a URL for a given file path.
     *
     * @param string $filePath
     * @return string
     */
    function urlForFile(string $filePath): string
    {
        return asset('storage/' . $filePath);
    }
}
