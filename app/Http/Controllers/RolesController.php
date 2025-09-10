<?php

namespace App\Http\Controllers;

use App\Http\Requests\Roles\StoreRoleRequest;
use App\Http\Requests\Roles\UpdateRoleRequest;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\BulkEditTrait;
use App\Traits\HasDependentDropdowns;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    use BulkDeleteTrait;
    use BulkEditTrait;
    use HasDependentDropdowns;

    private $columns;

    protected $filterRepository;

    public $searchColumns = ['name'];

    protected $exportService;

    public function __construct(FilterRepository $filterRepository, ExportService $exportService)
    {
        $this->filterRepository = $filterRepository;
        $this->exportService = $exportService;
        $this->columns = [
            [
                'header' => 'id',
                'accessor' => 'id',
                'visibility' => false,
                'type' => 'number',
            ],
            [
                'header' => 'name',
                'accessor' => 'name',
                'visibility' => true,
                'type' => 'string',
            ],
        ];
    }

    public function index()
    {
        return Inertia::render('Roles/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function search($search = null)
    {
        return $this->handleDependentSearch(
            Role::class,
            $search
        );
    }

    public function create($id = null)
    {
        $permissions = Permission::all()->groupBy('module');

        $role = null;
        if ($id) {
            $role = Role::find($id);
        }
        $fields = [
            [
                'label' => 'Name (EN)',
                'name' => 'name',
                'type' => 'string',
                'required' => true,
                'default' => $role?->name,
            ],
        ];

        return Inertia::render('Roles/Create', [
            'fields' => $fields,
            'permissions' => $permissions,
            'role' => $role,
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('success', 'Role created successfully.');
    }

    public function edit($id)
    {
        $role = Role::findOrFail($id);
        $permissions = Permission::all()->groupBy('module'); // Fetch all available permissions
        $rolePermissions = $role->permissions->pluck('name')->toArray();

        $fields = [
            [
                'label' => 'Name',
                'name' => 'name',
                'type' => 'string',
                'required' => true,
                'default' => $role->name,
            ],
        ];

        return Inertia::render('Roles/Edit', [
            'fields' => $fields,
            'role' => $role,
            'permissions' => $permissions,
            'rolePermissions' => $rolePermissions,
        ]);
    }

    public function update(UpdateRoleRequest $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return to_route('roles.index')->with('success', 'Role updated successfully.');
    }

    public function datatable(Request $request)
    {
        $query = Role::query();
        $data = $this->filterRepository->applyFilters($query, $request, $this->searchColumns);

        // Send the data and meta information
        return response()->json([
            'records' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
                'total' => $data->total(),
                'has_previous_page' => $data->currentPage() > 1,
                'has_next_page' => $data->currentPage() < $data->lastPage(),
            ],
        ]);
    }

    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        // Check if the role has related users
        if ($role->users()->exists()) {
            return redirect()->route('roles.index')
                ->with('error', 'Cannot delete role with related users.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('success', 'Role deleted successfully.');
    }

    public function bulkEdit(Request $request)
    {
        return $this->bulkEditMulti($request, Role::class, 'language_id');
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, Role::class, 'id');
    }

    public function export(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->export($request, 'id', Role::class, $columns);
    }

    public function pdf(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->pdf($request, 'id', Role::class, $columns);
    }
}
