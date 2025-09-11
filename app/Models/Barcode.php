<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Barcode extends Model
{
    use HasFactory;

    protected $table = 'barcodes';
    protected $primaryKey = 'barcode_id';
    protected $guarded = [];

    public function fixtureFurnishing()
    {
        return $this->belongsTo(FixtureFurnishing::class, 'fixture_furnishing_id', 'fixture_furnishing_id');
    }

    public function educationalMaterial()
    {
        return $this->belongsTo(EducationalMaterial::class, 'educational_material_id', 'educational_material_id');
    }
}


