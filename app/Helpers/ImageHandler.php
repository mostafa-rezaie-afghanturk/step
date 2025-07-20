<?php

namespace App\Helpers;

class ImageHandler
{
    public function uploadAndOptimize($file, $directory, $maxWidth = 800, $maxHeight = 600)
    {
        // Store the file in the specified directory
        $filePath = $file->store($directory, 'public');

        // Resize and optimize the uploaded image
        $this->resizeAndOptimizeImage(storage_path("app/public/{$filePath}"), $maxWidth, $maxHeight);

        return $filePath;
    }

    protected function resizeAndOptimizeImage($imagePath, $maxWidth, $maxHeight)
    {
        $info = getimagesize($imagePath);
        $originalWidth = $info[0];
        $originalHeight = $info[1];

        // Calculate new dimensions
        $ratio = $originalWidth / $originalHeight;
        if ($maxWidth / $maxHeight > $ratio) {
            $maxWidth = $maxHeight * $ratio;
        } else {
            $maxHeight = $maxWidth / $ratio;
        }

        // Create a new image resource with new dimensions
        $newImage = imagecreatetruecolor($maxWidth, $maxHeight);

        // Create the original image resource based on its type
        switch ($info['mime']) {
            case 'image/jpeg':
                $originalImage = imagecreatefromjpeg($imagePath);
                break;
            case 'image/png':
                $originalImage = imagecreatefrompng($imagePath);
                // Preserve transparency for PNG
                imagealphablending($newImage, false);
                imagesavealpha($newImage, true);
                break;
            case 'image/gif':
                $originalImage = imagecreatefromgif($imagePath);
                break;
            default:
                return; // Unsupported type
        }

        // Resize the image
        imagecopyresampled($newImage, $originalImage, 0, 0, 0, 0, $maxWidth, $maxHeight, $originalWidth, $originalHeight);

        // Optimize the image
        $this->optimizeImage($newImage, $info['mime'], $imagePath);

        // Free memory
        imagedestroy($originalImage);
        imagedestroy($newImage);
    }

    protected function optimizeImage($image, $mimeType, $imagePath)
    {
        // Save the image with quality settings
        switch ($mimeType) {
            case 'image/jpeg':
                imagejpeg($image, $imagePath, 75); // Quality 75
                break;
            case 'image/png':
                imagepng($image, $imagePath, 6); // Compression level 0-9 (6 is a good balance)
                break;
            case 'image/gif':
                imagegif($image, $imagePath); // No quality parameter for GIF
                break;
        }
    }
}
