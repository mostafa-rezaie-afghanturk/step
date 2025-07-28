<?php

namespace App\Traits;

trait UrlForFiles
{
    public function getPurchaseDocsUrlsAttribute()
    {
        return $this->purchaseDocs?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }

    public function getAllocationDocsUrlsAttribute()
    {
        return $this->allocationDocs?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }

    public function getLayoutPlansUrlsAttribute()
    {
        return $this->layoutPlans?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }

    public function getLeaseDocsUrlsAttribute()
    {
        return $this->leaseDocs?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }

    public function getLandPhotosUrlsAttribute()
    {
        return $this->landPhotos?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }

    public function getRoomPhotosUrlsAttribute()
    {
        return $this->roomPhotos?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }

    public function getWarrantyCertsUrlsAttribute()
    {
        return $this->warrantyCerts?->map(fn($file) => urlForFile($file->file_path))?->toArray();
    }
}
