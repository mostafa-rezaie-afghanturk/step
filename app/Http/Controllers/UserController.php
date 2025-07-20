<?php

namespace App\Http\Controllers;

use App\Helpers\DataValidationHelper;
use App\Imports\UsersImport;
use App\Models\Country;
use App\Models\Library;
use App\Models\ParentModel;
use App\Models\School;
use App\Models\Student;
use App\Models\User;
use App\Models\UserRestriction;
use App\Repositories\ActivityLogRepository;
use App\Repositories\ExportService;
use App\Repositories\FilterRepository;
use App\Traits\BulkDeleteTrait;
use App\Traits\HasDependentDropdowns;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use InvalidArgumentException;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Maatwebsite\Excel\Facades\Excel;


class UserController extends Controller
{
    use BulkDeleteTrait;
    use HasDependentDropdowns;

    private $columns;

    protected $filterRepository;

    protected $exportService;

    protected $schoolRepository;

    protected $libraryRepository;

    protected $countryRepository;

    protected $studentRepository;

    protected $activityLogRepository;

    public $searchColumns = ['user_code', 'name', 'email', 'country.name', 'school.name', 'library.name'];

    public function __construct(
        FilterRepository $filterRepository,
        ExportService $exportService,
        ActivityLogRepository $activityLogRepository,
    ) {
        $this->columns = $this->getColumns();
        $this->filterRepository = $filterRepository;
        $this->exportService = $exportService;
        $this->activityLogRepository = $activityLogRepository;
    }

    protected function getColumns()
    {
        return [
            [
                'header' => 'ID',
                'accessor' => 'id',
                'visibility' => false,
                'type' => 'number',
                'validation' => 'required|integer|exists:users,id',
                'context' => ['show'], // Only visible in the "show" view
            ],
            [
                'header' => 'User Code',
                'accessor' => 'user_code',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255|unique:users,user_code',
                'context' => ['show'],
            ],
            [
                'header' => 'Name',
                'accessor' => 'name',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required|string|max:255',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'Email',
                'accessor' => 'email',
                'visibility' => true,
                'type' => 'string',
                'validation' => 'required_without:username|string|max:255|email|unique:users,email',
                'context' => ['show', 'edit', 'create'], // Visible in all views
            ],
            [
                'header' => 'Password',
                'accessor' => 'password',
                'visibility' => false,
                'type' => 'password',
                'validation' => 'required|string|max:255',
                'context' => ['create'], // Visible in all views
            ],
        ];
    }

    public function index()
    {

        return Inertia::render('Users/Index', [
            'columns' => $this->columns,
        ]);
    }

    public function show(string $id)
    {
        $data = User::with([
            'roles'
        ])->findOrFail($id);

        // Add account type to the response
        $data->account_type = $data->userable ? class_basename($data->userable) : 'General User';

        return response()->json([
            'records' => [$data],
        ]);
    }

    public function country($search = null)
    {
        return $this->handleDependentSearch(
            Country::class,
            $search,
            null,
            null,
            null,
            'name',
            'country_id',
            null,
            function ($query) {
                return $this->countryRepository->applyCountryFilters($query);
            }
        );
    }

    public function roles($search = null)
    {
        return $this->handleDependentSearch(
            Role::class,
            $search
        );
    }

    // return associated student or parent based on account type
    public function associated($search = null)
    {
        $accountType = request()->get('account_type');
        $userId = request()->get('user_id');

        $modelClass = $accountType === 'student' ? Student::class : ParentModel::class;
        $searchField = $accountType === 'student' ? 'student_id' : 'id';

        return $this->handleDependentSearch(
            $modelClass,
            $search,
            null,
            null,
            null,
            'name',
            $searchField,
            function ($person) use ($accountType) {
                if ($accountType === 'student') {
                    return $person->name . ' ' . $person->last_name . ' - NID No: ' . $person->nid_number;
                } elseif ($accountType === 'parent') {
                    return $person->name . ' ' . $person->last_name . ' - ' . $person->phone_number;
                } else {
                    return $person->name . ' - ' . $person->email;
                }
            },
            function ($query) use ($userId) {
                // Allow the associated entity of the current user
                return $this->studentRepository
                    ->applyStudentFilters($query)
                    ->whereDoesntHave('user', function ($q) use ($userId) {
                        // Exclude others but include the current associated user
                        $q->where('id', '<>', $userId);
                    });
            }
        );
    }

    public function create($id = null)
    {
        $user = null;
        if ($id) {
            $user = User::where('id', $id)->first();
        }

        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        $options = [
            [
                'name' => 'country_id',
                'option' => Country::all()->pluck('name'),
            ],
            [
                'name' => 'school_id',
                'option' => School::all()->pluck('name'),
            ],
            [
                'name' => 'library_id',
                'option' => Library::all()->pluck('library_name'),
            ],
        ];
        // 'User', 'Magazine', 'Newspaper', 'Thesis', 'Article', 'Report', 'Dictionary', 'Atlas'
        // Map the editable columns to the desired format for fields
        $fields = array_map(function ($column) use ($options, $user) {

            $field = [
                'label' => $column['header'],
                'name' => $column['accessor'],
                'type' => $column['type'],
                'width' => $column['width'] ?? null,
                'default' => $user ? ($user[$column['accessor']] ?? null) : null,
                'search_url' => $column['search_url'] ?? null,
                'depends_on' => $column['depends_on'] ?? null,
                'required_if' => $column['required_if'] ?? null,
                'required' => str_contains($column['validation'], 'required'),
            ];

            // Loop through options to find matching accessors
            foreach ($options as $opt) {
                // Check if the accessor matches the name in options
                if ($column['accessor'] === $opt['name']) {
                    // Merge the entire option array into the field
                    $field = array_merge($field, $opt);
                    break; // Exit the loop once a match is found
                }
            }

            return $field; // Return the constructed field/ Return the constructed field
        }, $editableColumns);
        $fields = array_values($fields);
        $permissions = Permission::all(); // Fetch all available permissions
        $roles = Role::all();

        return Inertia::render('Users/Create', [
            'fields' => $fields,
            'user' => $user,
            'permissions' => $permissions,
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        // Get the editable columns from your column configuration
        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('create', $column['context']);
        });

        // Generate validation rules from column definitions
        $validationRules = [
            'userRestrictions' => 'nullable|array|min:0',
            'userRestrictions.*.country_id' => 'required|exists:countries,country_id',
            'userRestrictions.*.school_id' => 'nullable|exists:schools,school_id',
            'userRestrictions.*.library_id' => 'nullable|exists:libraries,library_id',
        ];

        foreach ($editableColumns as $column) {
            if (isset($column['validation'])) {
                $validationRules[$column['accessor']] = $column['validation'];
            }
        }

        // Add validation rule for profile_picture
        $validationRules['profile_picture'] = 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048';
        $validationRules['role'] = 'required|exists:roles,id';

        // Validate the request based on the generated rules
        $validatedData = $request->validate($validationRules);

        DB::beginTransaction();

        try {
            $user = null;

            if ($request->has('account_type') && ! empty($request->account_type) && $request->account_type !== 'General User') {
                $accountType = $request->input('account_type');

                // Map account types to corresponding models
                $modelClass = match ($accountType) {
                    'student' => Student::class,
                    'parent' => ParentModel::class,
                    default => throw new InvalidArgumentException("Invalid account type: $accountType"),
                };

                $associatedId = $request->input('associated_id');
                $record = $modelClass::findOrFail($associatedId);

                // Create the user associated with the related model
                $user = $record->user()->create(array_merge($validatedData, [
                    'user_code' => $this->generateUserCode(),
                ]));
            } else {
                // Create a standalone user record
                $user = User::create(array_merge($validatedData, [
                    'user_code' => $this->generateUserCode(),
                ]));
            }

            // Handle profile picture upload (nullable case)
            if ($request->hasFile('profile_picture')) {
                $file = $request->file('profile_picture');
                $filename = time() . '_' . $file->getClientOriginalName();
                $file->storeAs('profile_pictures', $filename, 'public');
                $user->profile_picture = 'profile_pictures/' . $filename;
            } else {
                // If no file is uploaded, set the default profile picture
                $user->profile_picture = 'assets/img/profile_user.jpg';
            }

            $user->save();

            // Sync roles if provided
            $role = $request->input('role', []);
            $user->syncRoles($role);


            if ($request->has('userRestrictions') && is_array($request->input('userRestrictions'))) {
                foreach ($request->input('userRestrictions') as $restriction) {
                    UserRestriction::insert([
                        'user_id' => $user->id,
                        'country_id' => $restriction['country_id'],
                        'school_id' => $restriction['school_id'] ?? null,
                        'library_id' => $restriction['library_id'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('users.index')->with('success', 'User created successfully.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return back()->withErrors(['associated_id' => 'The associated model does not exist.']);
        } catch (InvalidArgumentException $e) {
            DB::rollBack();

            return back()->withErrors(['account_type' => $e->getMessage()]);
        } catch (Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'An unexpected error occurred.']);
        }
    }

    public function datatable(Request $request)
    {
        $query = User::query();
        $query->with('userRestrictions');

        // Only list users without a userable
        $query->whereNull('userable_id');

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

    public function edit($id)
    {
        $user = User::with(['userRestrictions', 'roles'])->findOrFail($id);
        $roles = Role::all();

        $fields = [
            [
                'label' => 'Name',
                'name' => 'name',
                'type' => 'string',
                'required' => true,
                'default' => $user?->name,
            ],
            [
                'label' => 'Username',
                'name' => 'username',
                'type' => 'string',
                'required' => true,
                'default' => $user?->username,
            ],
            [
                'label' => 'Email',
                'name' => 'email',
                'type' => 'string',
                'required' => true,
                'default' => $user?->email,
            ],
        ];

        return Inertia::render('Users/Edit', [
            'fields' => array_values($fields),
            'user' => $user,
            'roles' => $roles,
            'userRestrictions' => $user->userRestrictions,
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        // Get the editable columns from your column configuration
        $editableColumns = array_filter($this->getColumns(), function ($column) {
            return in_array('edit', $column['context']);
        });

        // Generate validation rules from column definitions
        $validationRules = [
            'userRestrictions' => 'nullable|array|min:0',
            'userRestrictions.*.country_id' => 'required|exists:countries,country_id',
            'userRestrictions.*.school_id' => 'nullable|exists:schools,school_id',
            'userRestrictions.*.library_id' => 'nullable|exists:libraries,library_id',
        ];

        foreach ($editableColumns as $column) {
            if (isset($column['validation'])) {
                // Make password optional on update
                if ($column['accessor'] === 'password') {
                    $validationRules[$column['accessor']] = 'nullable|string|max:255';

                    continue;
                }

                if ($column['accessor'] === 'email') {
                    $validationRules[$column['accessor']] = 'required_without:username|string|max:255|email|unique:users,email,' . $id;

                    continue;
                }

                if ($column['accessor'] === 'username') {
                    $validationRules[$column['accessor']] = 'required_without:email|string|max:255|unique:users,username,' . $id;

                    continue;
                }

                $validationRules[$column['accessor']] = $column['validation'];
            }
        }

        $validationRules['roles'] = 'required|array';
        $validationRules['roles.value'] = 'required|exists:roles,id';

        // Validate the request
        $validatedData = $request->validate($validationRules);

        // Remove password from validated data if it's empty
        if (empty($validatedData['password'])) {
            unset($validatedData['password']);
        } else {
            $validatedData['password'] = bcrypt($validatedData['password']);
        }

        DB::beginTransaction();

        try {
            if ($request->has('account_type') && ! empty($request->account_type) && $request->account_type !== 'General User') {
                $accountType = $request->input('account_type');
                $userableType = match ($accountType) {
                    'student' => Student::class,
                    'parent' => ParentModel::class,
                    default => throw new InvalidArgumentException("Invalid account type: $accountType"),
                };

                $userableId = $request->input('associated_id');
                $userableModel = $userableType::findOrFail($userableId);

                // Disassociate current userable if exists and update user
                if ($user->userable) {
                    $user->userable()->dissociate();
                }

                $user->update(array_merge($validatedData, [
                    'userable_id' => $userableId,
                    'userable_type' => $userableType,
                ]));

                // Associate with the new userable
                $user->userable()->associate($userableModel)->save();
            } else {
                // Update standalone user
                $user->update($validatedData);
            }

            // Sync roles if provided
            if ($request->has('roles')) {
                $user->syncRoles($request->input('roles', []));
            }

            if ($request->has('userRestrictions') && is_array($request->input('userRestrictions'))) {
                // Delete all existing user restrictions
                $user->userRestrictions()->delete();

                // Store the new user restrictions
                foreach ($request->input('userRestrictions') as $restriction) {
                    UserRestriction::insert([
                        'user_id' => $user->id,
                        'country_id' => $restriction['country_id'],
                        'school_id' => $restriction['school_id'] ?? null,
                        'library_id' => $restriction['library_id'] ?? null,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('users.index')->with('success', 'User updated successfully.');
        } catch (ModelNotFoundException $e) {
            DB::rollBack();

            return back()->withErrors(['associated_id' => 'The associated model does not exist.']);
        } catch (InvalidArgumentException $e) {
            DB::rollBack();

            return back()->withErrors(['account_type' => $e->getMessage()]);
        } catch (Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'An unexpected error occurred.' . $e->getMessage()]);
        }
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);

        if ($user->userable()->exists()) {
            return redirect()->route('users.index')->withErrors(['error' => 'Cannot delete user with related userable entity.']);
        }

        $user->delete();

        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    public function bulkEdit(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'ids' => 'required|array',
            'field' => 'required|string',
            'value' => 'required',
        ]);

        // Get the model and the table name
        $model = new Library;
        $table = $model->getTable();

        // Check if the field is fillable
        if (! in_array($validated['field'], $model->getFillable())) {
            return response()->json([
                'message' => "The selected field '{$validated['field']}' cannot be updated. Allowed fields are: " . implode(', ', $model->getFillable()),
            ], 400);
        }

        // Check if the field exists in the database
        if (! Schema::hasColumn($table, $validated['field'])) {
            return response()->json([
                'message' => "The selected field '{$validated['field']}' does not exist in the '{$table}' table.",
            ], 400);
        }

        // Validate each row before performing updates
        foreach ($validated['ids'] as $id) {
            // Retrieve the current library record
            $library = Library::find($id);
            if (! $library) {
                return response()->json(['message' => "Library record with ID {$id} not found."], 404);
            }

            // Retrieve validation rules for the current field
            // $fieldValidationRules = $this->getValidationRules()[$validated['field']] ?? null;

            // Validate the current row's value against the retrieved rules
            // $rowData = ['value' => $validated['value']];
            // $validator = Validator::make($rowData, [
            //     'value' => $fieldValidationRules,
            // ]);

            // If validation fails, return the error for that row
            // if ($validator->fails()) {
            //     return response()->json(['message' => "Validation failed for library ID {$id}: " . implode(', ', $validator->errors()->all())], 400);
            // }
        }

        // Get the field type
        $columnType = Schema::getColumnType($table, $validated['field']);

        // Perform a check based on the column type
        $isValid = DataValidationHelper::isValidValueForColumn($columnType, $validated['value'], $table, $validated['field']);
        if ($isValid !== true) {
            $errorMessage = "The value '{$validated['value']}' is not valid for the field '{$validated['field']}'.";

            // If the column type is enum, specify allowed values
            if ($columnType === 'enum') {
                $enumValues = DataValidationHelper::isValidEnumValue($table, $validated['field'], $validated['value']);
                $errorMessage .= ' Please use one of the valid enum values: ' . implode(', ', $enumValues) . '.';
            }

            return response()->json(['message' => $errorMessage], 400);
        }

        // Perform the bulk update
        $updatedCount = Library::whereIn('library_id', $validated['ids'])->update([
            $validated['field'] => $validated['value'],
        ]);

        if ($updatedCount === 0) {
            return response()->json(['message' => 'No matching records found to update for the provided IDs.'], 404);
        }

        // Return a successful response
        return response()->json(['message' => 'Records updated successfully.', 'updated_count' => $updatedCount]);
    }

    public function bulkDelete(Request $request)
    {
        return $this->bulkDeleteMulti($request, User::class, 'id');
    }

    public function export(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->export($request, 'id', User::class, $columns);
    }

    public function pdf(Request $request)
    {
        $columns = $this->columns;

        return $this->exportService->pdf($request, 'id', User::class, $columns);
    }

    public function changePassword(Request $request, $id)
    {
        $request->validate([
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($id);
        $user->password = Hash::make($request->new_password);
        $user->save();

        return redirect()->route('users.index')->with('success', 'Password changed successfully.');
    }

    public function logActivity(Request $request, $id)
    {
        try {
            $response = $this->activityLogRepository->getLogs(User::class, $id, $request, ['id', 'causer.name', 'event']);

            return response()->json($response);
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        Excel::import(new UsersImport, $request->file);

        // return redirect()->route('users.index')
        //     ->with('success', 'Users imported successfully!');
        return back()->with('success', 'Users imported successfully!');
    }

    /**
     * Generate a unique user_code like U0001, U0002, ...
     */
    private function generateUserCode()
    {
        $lastUser = \App\Models\User::orderByDesc('user_code')->where('user_code', 'like', 'U%')->first();
        $next = 1;
        if ($lastUser && preg_match('/U(\d{4})/', $lastUser->user_code, $matches)) {
            $next = intval($matches[1]) + 1;
        }
        return 'U' . str_pad($next, 4, '0', STR_PAD_LEFT);
    }
}
