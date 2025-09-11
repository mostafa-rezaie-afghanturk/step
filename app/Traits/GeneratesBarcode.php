<?php

namespace App\Traits;

use App\Models\Barcode;
use App\Models\EducationalMaterial;
use App\Models\FixtureFurnishing;
use Illuminate\Support\Facades\Storage;

trait GeneratesBarcode
{
    protected function saveBarcodeImage(string $generatedBarcode, string $subfolder): ?string
    {
        try {
            $barcodeImage = new \Milon\Barcode\DNS1D;
            $barcodePNG = $barcodeImage->getBarcodePNG($generatedBarcode, 'C128', 2, 60);
            $filename = time() . '_' . $generatedBarcode . '.png';
            $relativePath = "barcodes/{$subfolder}/{$filename}";
            Storage::disk('public')->put($relativePath, base64_decode($barcodePNG));
            return $relativePath;
        } catch (\Throwable $th) {
            return null;
        }
    }

    public function createBarcodeForFixture(FixtureFurnishing $fixtureFurnishing): void
    {
        try {
            $relativePath = $this->saveBarcodeImage($fixtureFurnishing->asset_code, 'fixtures');
            if ($relativePath) {
                Barcode::updateOrCreate(
                    ['fixture_furnishing_id' => $fixtureFurnishing->fixture_furnishing_id],
                    ['barcode_image_path' => $relativePath]
                );
            }
        } catch (\Throwable $th) {
            // ignore
        }
    }

    public function refreshBarcodeForFixtureIfNeeded(FixtureFurnishing $fixtureFurnishing): void
    {
        try {
            $exists = Barcode::where('fixture_furnishing_id', $fixtureFurnishing->fixture_furnishing_id)->exists();
            if ($fixtureFurnishing->wasChanged('asset_code') || !$exists) {
                $this->createBarcodeForFixture($fixtureFurnishing);
            }
        } catch (\Throwable $th) {
            // ignore
        }
    }

    public function createBarcodeForEducationalMaterial(EducationalMaterial $educationalMaterial): void
    {
        try {
            $relativePath = $this->saveBarcodeImage($educationalMaterial->asset_code, 'educational-materials');
            if ($relativePath) {
                Barcode::updateOrCreate(
                    ['educational_material_id' => $educationalMaterial->educational_material_id],
                    ['barcode_image_path' => $relativePath]
                );
            }
        } catch (\Throwable $th) {
            // ignore
        }
    }

    public function refreshBarcodeForEducationalMaterialIfNeeded(EducationalMaterial $educationalMaterial): void
    {
        try {
            $exists = Barcode::where('educational_material_id', $educationalMaterial->educational_material_id)->exists();
            if ($educationalMaterial->wasChanged('asset_code') || !$exists) {
                $this->createBarcodeForEducationalMaterial($educationalMaterial);
            }
        } catch (\Throwable $th) {
            // ignore
        }
    }
}


