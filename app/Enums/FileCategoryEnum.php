<?php

namespace App\Enums;

enum FileCategoryEnum: string
{
    case PURCHASE_DOC = 'purchase_doc';
    case ALLOCATION_DOC = 'allocation_doc';
    case LAYOUT_PLAN = 'layout_plan';
    case LEASE_DOC = 'lease_doc';
    case LAND_PHOTO = 'land_photo';
    case ROOM_PHOTO = 'room_photo';
    case WARRANTY_CERT = 'warranty_cert';
    case BUILDING_PROJECT = 'building_project';
    case ASSET_PHOTO = 'asset_photo';

    public function folder(): string
    {
        return config('files.subfolders')[$this->value] ?? 'others';
    }
}
