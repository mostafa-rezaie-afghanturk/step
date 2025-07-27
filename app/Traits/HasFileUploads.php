<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HasFileUploads
{
    /**
     * Map input names to FileCategoryEnum
     * Should be implemented by the model.
     */
    public function fileInputs(): array
    {
        return [];
    }

    /**
     * Handles file upload and attaching to model (create & update compatible)
     * Accepts both UploadedFile[] and URL[] in request input for each file input.
     */
    public function handleFileUploads(Request $request, string $relation = 'files'): void
    {
        foreach ($this->fileInputs() as $input => $categoryEnum) {
            $newFiles = $request->input($input, []);
            // If files are uploaded, merge them in
            if ($request->hasFile($input)) {
                $uploaded = $request->file($input);
                $uploaded = is_array($uploaded) ? $uploaded : [$uploaded];
                $newFiles = array_merge($newFiles, $uploaded);
            }

            // If $newFiles is empty, skip
            if (empty($newFiles)) continue;

            // Get current files from relation
            $currentFiles = $this->{$relation}()->where('category', $categoryEnum->value)->get();
            $keepPaths = [];

            // 1. Keep URLs and collect their DB file_path
            foreach ($newFiles as $item) {
                if (is_string($item)) {
                    $parsed = parse_url($item, PHP_URL_PATH);
                    $storagePos = strpos($parsed, '/storage/');
                    if ($storagePos !== false) {
                        $filePath = substr($parsed, $storagePos + strlen('/storage/'));
                        $keepPaths[] = $filePath;
                    }
                }
            }

            // 2. Remove files not present in $newFiles
            foreach ($currentFiles as $file) {
                if (!in_array($file->file_path, $keepPaths)) {
                    Storage::disk('public')->delete($file->file_path);
                    $file->delete();
                }
            }

            // 3. Add new uploads
            foreach ($newFiles as $item) {
                if ($item instanceof \Illuminate\Http\UploadedFile) {
                    $path = $item->store('uploads/' . $categoryEnum->folder(), 'public');
                    $this->{$relation}()->create([
                        'name'       => $item->getClientOriginalName(),
                        'file_path'  => $path,
                        'file_type'  => $item->getClientMimeType(),
                        'details'    => json_encode(['size' => $item->getSize()]),
                        'category'   => $categoryEnum->value,
                    ]);
                }
            }
        }
    }

    /**
     * Handles updating file uploads: keeps existing, adds new, removes deleted.
     *
     * @param Request $request
     * @param array $newFiles Array of URLs and/or UploadedFile instances
     * @param string $relation
     * @param string|null $category (optional, for single category inputs)
     */
    public function updateFileUploads(Request $request, array $newFiles, string $relation = 'files', $category = null): void
    {
        $currentFiles = $this->{$relation}()->get();
        $keepPaths = [];

        // 1. Keep URLs and collect their DB file_path
        foreach ($newFiles as $item) {
            if (is_string($item)) {
                // Extract file_path from URL (assuming /storage/ is in URL)
                $parsed = parse_url($item, PHP_URL_PATH);
                $storagePos = strpos($parsed, '/storage/');
                if ($storagePos !== false) {
                    $filePath = substr($parsed, $storagePos + strlen('/storage/'));
                    $keepPaths[] = $filePath;
                }
            }
        }

        // 2. Remove files not present in $newFiles
        foreach ($currentFiles as $file) {
            if (!in_array($file->file_path, $keepPaths)) {
                // Delete from storage
                Storage::disk('public')->delete($file->file_path);
                // Delete from DB
                $file->delete();
            }
        }

        // 3. Add new uploads
        foreach ($newFiles as $item) {
            if ($item instanceof \Illuminate\Http\UploadedFile) {
                // Determine category enum
                $categoryEnum = $category;
                if (!$categoryEnum && method_exists($this, 'fileInputs')) {
                    // Try to find category by input name
                    foreach ($this->fileInputs() as $input => $enum) {
                        if ($request->hasFile($input)) {
                            $categoryEnum = $enum;
                            break;
                        }
                    }
                }
                $folder = $categoryEnum ? $categoryEnum->folder() : 'misc';
                $catValue = $categoryEnum ? $categoryEnum->value : null;
                $path = $item->store('uploads/' . $folder, 'public');
                $this->{$relation}()->create([
                    'name'       => $item->getClientOriginalName(),
                    'file_path'  => $path,
                    'file_type'  => $item->getClientMimeType(),
                    'details'    => json_encode(['size' => $item->getSize()]),
                    'category'   => $catValue,
                ]);
            }
        }
    }
}
