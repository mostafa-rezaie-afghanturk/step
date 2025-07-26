<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait FileUploadTrait
{
    /**
     * Store uploaded files and return their paths.
     *
     * @param array|UploadedFile $files
     * @param string $directory
     * @return array
     */
    public function storeFiles($files, string $directory): array
    {
        $filePaths = [];

        // Ensure $files is an array
        $files = is_array($files) ? $files : [$files];

        foreach ($files as $file) {
            if ($file instanceof UploadedFile) {
                // Store the file in the specified directory
                $path = $file->store($directory, 'public');
                $filePaths[] = [
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'mime_type' => $file->getMimeType(),
                ];
            }
        }

        return $filePaths;
    }

    /**
     * Associate files with a model via polymorphic relationship.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param array $fileData
     * @param string $type
     * @return void
     */
    public function associateFiles($model, array $fileData, string $type): void
    {
        foreach ($fileData as $data) {
            $model->files()->create([
                'file_name' => $data['file_name'],
                'file_path' => $data['file_path'],
                'mime_type' => $data['mime_type'],
                'file_type' => $type, // e.g., 'lease_docs', 'allocation_docs', etc.
            ]);
        }
    }

    /**
     * Delete files associated with a model.
     *
     * @param \Illuminate\Database\Eloquent\Model $model
     * @param string $type
     * @return void
     */
    public function deleteFiles($model, string $type): void
    {
        $files = $model->files()->where('file_type', $type)->get();
        foreach ($files as $file) {
            Storage::disk('public')->delete($file->file_path);
            $file->delete();
        }
    }
}
