<?php

namespace App\Traits;

use App\Enums\FileCategoryEnum;
use App\Models\File;
use Illuminate\Database\Eloquent\Relations\MorphMany;

trait MorphManyFiles
{
    /**
     * Get all related files.
     */
    public function files(): MorphMany
    {
        return $this->morphMany(File::class, 'fileable');
    }

    /**
     * Get related allocation documents.
     */
    public function allocationDocs(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::ALLOCATION_DOC->value);
    }

    /**
     * Get related purchase documents.
     */
    public function purchaseDocs(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::PURCHASE_DOC->value);
    }

    public function layoutPlans(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::LAYOUT_PLAN->value);
    }

    public function leaseDocs(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::LEASE_DOC->value);
    }

    public function landPhotos(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::LAND_PHOTO->value);
    }

    public function roomPhotos(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::ROOM_PHOTO->value);
    }

    public function warrantyCerts(): MorphMany
    {
        return $this->files()->where('category', FileCategoryEnum::WARRANTY_CERT->value);
    }
}
