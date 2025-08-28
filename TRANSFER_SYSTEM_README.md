# Transfer System Implementation

This document describes the implementation of the transfer system for the monitoring and evaluation system.

## Overview

The transfer system allows users to transfer assets (fixtures/furnishings and educational materials) between users, track the transfer history, and manage returns.

## Database Structure

### TransferTransaction Table

```sql
CREATE TABLE transfer_transactions (
    transfer_transaction_id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    transfer_date DATE NOT NULL,
    from_user_id BIGINT UNSIGNED NOT NULL,
    to_user_id BIGINT UNSIGNED NOT NULL,
    asset_or_material_type VARCHAR(255) NOT NULL,
    asset_or_material_id BIGINT UNSIGNED NOT NULL,
    return_status ENUM('Transferred', 'Returned') DEFAULT 'Transferred',
    notes TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    
    FOREIGN KEY (from_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (to_user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    INDEX idx_from_user_date (from_user_id, transfer_date),
    INDEX idx_to_user_date (to_user_id, transfer_date),
    INDEX idx_asset_material (asset_or_material_type, asset_or_material_id),
    INDEX idx_return_status (return_status)
);
```

## Models

### TransferTransaction Model

The main model for transfer transactions with the following features:

- **Relationships**: 
  - `fromUser()` - User who initiated the transfer
  - `toUser()` - User who received the transfer
  - `assetOrMaterial()` - Polymorphic relationship to the transferred asset
- **Scopes**: 
  - `active()` - Returns only active transfers
  - `returned()` - Returns only returned transfers
- **Methods**: 
  - `isActive()` - Check if transfer is active
  - `isReturned()` - Check if transfer has been returned

### Updated Models

#### User Model
- `transfersInitiated()` - Transfers initiated by the user
- `transfersReceived()` - Transfers received by the user
- `allTransfers()` - All transfers involving the user

#### FixtureFurnishing & EducationalMaterial Models
- `transferTransactions()` - All transfer transactions for the asset
- `currentHolder()` - Current holder of the asset
- `isTransferred()` - Check if asset is currently transferred

## Controllers

### TransferController

Provides the following endpoints:

- **Index** (`GET /transfers`) - List all transfers with filtering
- **Create** (`GET /transfers/create`) - Show create form
- **Store** (`POST /transfers`) - Create new transfer
- **Show** (`GET /transfers/{id}`) - View transfer details
- **Edit** (`GET /transfers/{id}/edit`) - Show edit form
- **Update** (`PUT /transfers/{id}`) - Update transfer
- **Return** (`POST /transfers/{id}/return`) - Mark transfer as returned
- **Destroy** (`DELETE /transfers/{id}`) - Delete transfer
- **API Endpoints**:
  - `GET /transfers/available-assets` - Get available assets for transfer
  - `GET /transfers/asset-history` - Get transfer history for an asset

## Frontend Components

### React Components

1. **Index.jsx** - Lists all transfers with filtering and actions
2. **Create.jsx** - Form to create new transfers
3. **Show.jsx** - Detailed view of a transfer
4. **Edit.jsx** - Form to edit existing transfers

### Features

- **Permission-based access control** using Spatie Laravel Permission
- **Real-time validation** and error handling
- **Responsive design** with Tailwind CSS
- **Internationalization** support
- **Action buttons** for common operations (view, edit, return, delete)

## Routes

```php
Route::group(['prefix' => 'transfers'], function () {
    Route::get('/', [TransferController::class, 'index'])->name('transfers.index');
    Route::get('/create', [TransferController::class, 'create'])->name('transfers.create');
    Route::post('/', [TransferController::class, 'store'])->name('transfers.store');
    Route::get('/{id}', [TransferController::class, 'show'])->name('transfers.show');
    Route::get('/{id}/edit', [TransferController::class, 'edit'])->name('transfers.edit');
    Route::put('/{id}', [TransferController::class, 'update'])->name('transfers.update');
    Route::delete('/{id}', [TransferController::class, 'destroy'])->name('transfers.delete');
    Route::post('/{id}/return', [TransferController::class, 'return'])->name('transfers.return');
    
    // API endpoints
    Route::get('/available-assets', [TransferController::class, 'getAvailableAssets']);
    Route::get('/asset-history', [TransferController::class, 'getAssetHistory']);
});
```

## Permissions

The system includes the following permissions:

- `transfers read` - View transfers
- `transfers create` - Create new transfers
- `transfers edit` - Edit existing transfers
- `transfers delete` - Delete transfers
- `transfers export` - Export transfer data

## Business Logic

### Transfer Creation

1. **Validation**: Ensures all required fields are provided
2. **Asset Availability**: Checks if the asset is already transferred
3. **User Validation**: Prevents self-transfers
4. **Date Validation**: Transfer date cannot be in the future

### Transfer Return

1. **Status Check**: Only active transfers can be returned
2. **Status Update**: Changes return_status to 'Returned'
3. **Audit Trail**: Maintains transfer history

### Asset Tracking

1. **Current Holder**: Tracks who currently has the asset
2. **Transfer History**: Maintains complete audit trail
3. **Availability Status**: Shows if asset is available for transfer

## Testing

### Test Files

- **TransferTest.php** - Feature tests for transfer functionality
- **TransferTransactionFactory.php** - Factory for creating test data

### Test Coverage

- Transfer creation and validation
- Transfer status updates
- Model relationships
- Business logic validation

## Installation & Setup

### 1. Run Migration

```bash
php artisan migrate
```

### 2. Seed Permissions

```bash
php artisan db:seed --class=TransferPermissionsSeeder
```

### 3. Assign Permissions

Ensure users have appropriate permissions assigned through roles.

## Usage Examples

### Creating a Transfer

```php
$transfer = TransferTransaction::create([
    'from_user_id' => $fromUser->id,
    'to_user_id' => $toUser->id,
    'asset_or_material_type' => FixtureFurnishing::class,
    'asset_or_material_id' => $fixture->id,
    'transfer_date' => now()->toDateString(),
    'notes' => 'Transfer for project use'
]);
```

### Checking Asset Status

```php
$fixture = FixtureFurnishing::find($id);

if ($fixture->isTransferred()) {
    $currentHolder = $fixture->currentHolder();
    echo "Asset is currently with: " . $currentHolder->name;
} else {
    echo "Asset is available for transfer";
}
```

### Getting User Transfer History

```php
$user = User::find($id);

// Transfers initiated by user
$initiated = $user->transfersInitiated;

// Transfers received by user
$received = $user->transfersReceived;

// All transfers involving user
$allTransfers = $user->allTransfers;
```

## Security Features

- **Permission-based access control**
- **Input validation and sanitization**
- **SQL injection protection** through Eloquent ORM
- **CSRF protection** on all forms
- **Audit logging** for all transfer operations

## Future Enhancements

1. **Bulk Transfers** - Transfer multiple assets at once
2. **Transfer Approvals** - Workflow for transfer approval
3. **Email Notifications** - Notify users of transfers
4. **Transfer Templates** - Predefined transfer scenarios
5. **Reporting** - Advanced transfer analytics and reporting
6. **Mobile App** - Mobile interface for transfers

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure user has appropriate transfer permissions
2. **Asset Not Found**: Check if asset exists and is not already transferred
3. **Validation Errors**: Verify all required fields are provided
4. **Database Errors**: Check database connection and table structure

### Debug Mode

Enable debug mode in `.env` to see detailed error messages:

```env
APP_DEBUG=true
```

## Support

For technical support or questions about the transfer system, please refer to the system documentation or contact the development team.
