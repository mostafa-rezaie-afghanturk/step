<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $exportService;

    public function __construct() {}

    public function index(Request $request)
    {
        return Inertia::render('Dashboard', []);
    }
}
