<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class DynamicExport implements FromQuery, ShouldAutoSize, WithHeadings, WithMapping
{
    protected $query;

    protected $headings;

    protected $mapCallback;

    /**
     * Constructor to accept a query builder, headings, and map callback.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     */
    public function __construct($query, array $headings, callable $mapCallback)
    {
        $this->query = $query;
        $this->headings = $headings;
        $this->mapCallback = $mapCallback;
    }

    /**
     * Fetch the query in chunks to handle large datasets.
     *
     * @return \Illuminate\Database\Query\Builder
     */
    public function query()
    {
        return $this->query;
    }

    /**
     * Provide the dynamic headings.
     */
    public function headings(): array
    {
        return $this->headings;
    }

    /**
     * Map the rows dynamically.
     */
    public function map($row): array
    {
        return call_user_func($this->mapCallback, $row);
    }
}
