# General Ledger (GL) Module - Complete Operations Guide

## Overview
The General Ledger module provides comprehensive financial accounting functionality including chart of accounts management, GL transaction entry, batch posting, and reporting.

## Service Layer: `src/services/general-ledger.service.ts`

### Core CRUD Operations

#### Chart of Accounts

**Create Account**
```typescript
const account = await glService.createAccount({
  tenant_id: 'tenant-id',
  account_code: '1010',
  account_name: 'Cash - Bank',
  account_type: 'asset',
  account_level: 1,
  is_header: false,
  normal_balance: 'debit',
  opening_balance: 50000,
  description: 'Main bank account'
});
```

**Get Accounts**
```typescript
// All accounts
const accounts = await glService.getAccounts('tenant-id');

// With filters
const assetAccounts = await glService.getAccounts('tenant-id', {
  isActive: true,
  accountType: 'asset'
});
```

**Get Single Account**
```typescript
const account = await glService.getAccountById('account-id');
```

**Update Account**
```typescript
const updated = await glService.updateAccount('account-id', {
  account_name: 'Updated Name',
  is_active: false
});
```

**Delete Account**
```typescript
// Throws error if account has GL entries
await glService.deleteAccount('account-id');
```

**Get Account Hierarchy**
```typescript
const hierarchy = await glService.getAccountHierarchy('tenant-id');
// Returns accounts grouped by type
```

#### GL Transactions

**Create GL Entry**
```typescript
const entry = await glService.createGLEntry({
  tenant_id: 'tenant-id',
  batch_id: 'batch-id',
  gl_date: '2024-11-13',
  account_id: 'account-id',
  debit_amount: 1000,
  credit_amount: 0,
  description: 'Opening balance adjustment',
  reference_number: 'JE-001',
  currency: 'KES'
});
```

**Get GL Entries**
```typescript
// All entries
const entries = await glService.getGLEntries('tenant-id');

// With filters
const entries = await glService.getGLEntries('tenant-id', {
  batchId: 'batch-id',
  accountId: 'account-id',
  costCenterId: 'cost-center-id',
  dateRange: ['2024-01-01', '2024-12-31']
});
```

**Get Single Entry**
```typescript
const entry = await glService.getGLEntryById('entry-id');
```

**Update GL Entry**
```typescript
const updated = await glService.updateGLEntry('entry-id', {
  description: 'Updated description',
  debit_amount: 1500
});
```

**Delete GL Entry**
```typescript
// Only unposted entries can be deleted
await glService.deleteGLEntry('entry-id');
```

**Get Account Balance**
```typescript
const balance = await glService.getAccountBalance('account-id', '2024-11-13');
// Returns balance as of the specified date
```

**Get Account Transaction History**
```typescript
const history = await glService.getAccountTransactionHistory('account-id', 'tenant-id');
// Returns all transactions for the account
```

#### GL Batches

**Create Batch**
```typescript
const batch = await glService.createBatch({
  tenant_id: 'tenant-id',
  batch_number: 'JB-2024-11-001',
  batch_description: 'Opening balances',
  batch_type: 'manual_je',
  status: 'draft',
  entry_count: 2,
  total_debit: 50000,
  total_credit: 50000,
  is_balanced: true
});
```

**Get Batches**
```typescript
// All batches
const batches = await glService.getBatches('tenant-id');

// With filters
const draftBatches = await glService.getBatches('tenant-id', {
  status: 'draft',
  batchType: 'manual_je'
});
```

**Get Single Batch**
```typescript
const batch = await glService.getBatchById('batch-id');
```

**Update Batch**
```typescript
const updated = await glService.updateBatch('batch-id', {
  status: 'in_review',
  batch_description: 'Updated description'
});
```

**Validate Batch Balance**
```typescript
const validation = await glService.validateBatchBalance('batch-id');
// Returns:
// {
//   isBalanced: boolean,
//   totalDebit: number,
//   totalCredit: number,
//   variance: number
// }
```

### Advanced Operations

#### Post Batch
Permanently records all GL entries in a batch and marks them as posted.

```typescript
await glService.postBatch('batch-id', 'user-id');
```

- Validates that debits equal credits
- Updates batch status to 'posted'
- Sets posted_at timestamp on all entries
- Throws error if batch is not balanced

#### Reverse Batch
Creates a reversal batch with all entries reversed (debits become credits, vice versa).

```typescript
const reversalBatch = await glService.reverseBatch('batch-id', 'Reversal reason', 'user-id');
```

- Creates new batch with 'REV' suffix
- Automatically posts reversal entries
- Original batch marked as 'reversed'
- All entries audit trail preserved

#### Generate Trial Balance
Produces trial balance as of a specific date, grouped by account type.

```typescript
const trialBalance = await glService.getTrialBalance('tenant-id', '2024-11-30');
// Returns: [
//   {
//     account_code: '1010',
//     account_name: 'Cash',
//     account_type: 'asset',
//     debit: 100000,
//     credit: 0,
//     balance: 100000
//   },
//   ...
// ]
```

#### Period Balances
Manages period-end account snapshots.

```typescript
const balances = await glService.getPeriodBalances('tenant-id', 'period-id');

// Lock period balances
await glService.lockPeriodBalances('tenant-id', 'period-id', 'user-id');
```

## UI Components

### `src/components/GL/ChartOfAccountsList.tsx`
- Full CRUD interface for chart of accounts
- Search and filter by type
- Hierarchical account display
- Create, edit, delete accounts

### `src/components/GL/GLTransactionsList.tsx`
- Display GL transactions with filtering
- Date range filtering
- Export to CSV
- Balance validation display
- Delete draft entries

### `src/components/GL/GLBatchManager.tsx`
- Create and manage GL batches
- Post batches (with validation)
- Reverse posted batches
- View batch details and entries
- Balance validation

### `src/components/GL/TrialBalanceReport.tsx`
- Generate trial balance as of date
- Group by account type
- Export to CSV
- Balance validation status

## Database Schema

### `chart_of_accounts`
- Hierarchical account structure
- Account types: asset, liability, equity, revenue, expense, cost_of_sales
- Support for sub-accounts and account levels
- Opening balances and normal balance direction

### `general_ledger`
- Individual GL transactions
- Links to batches for posting control
- Source document tracking
- Cost center allocation
- Reconciliation status tracking

### `gl_batch`
- Batch posting control
- Status workflow: draft → in_review → approved → posted
- Balance validation
- Reversal tracking with audit trail

### `gl_period_balances`
- Period-end snapshots of account balances
- Period locking for audit compliance
- Opening, period, and closing balances

## Batch Posting Workflow

1. **Draft** - Create entries
2. **In Review** - Review and validate
3. **Validate Balance** - Ensure Dr = Cr
4. **Post** - Permanently record and lock
5. **Optional: Reverse** - Create reversal with audit trail

## Security Features

- Row-level security (RLS) by tenant_id
- User audit trails (created_by, updated_by)
- Posted entry immutability (cannot delete posted entries)
- Period locking prevents retroactive changes
- Batch validation ensures data integrity

## Error Handling

```typescript
try {
  await glService.postBatch(batchId, userId);
} catch (error) {
  if (error.message.includes('not balanced')) {
    console.error('Batch has unequal debits and credits');
  }
  if (error.message.includes('Cannot delete')) {
    console.error('Cannot delete entry with posted status');
  }
}
```

## Example Usage - Complete Workflow

```typescript
// 1. Create accounts
const bankAccount = await glService.createAccount({
  tenant_id: 'tenant-1',
  account_code: '1010',
  account_name: 'Bank Account',
  account_type: 'asset',
  normal_balance: 'debit',
  opening_balance: 100000
});

const equityAccount = await glService.createAccount({
  tenant_id: 'tenant-1',
  account_code: '3010',
  account_name: 'Opening Capital',
  account_type: 'equity',
  normal_balance: 'credit',
  opening_balance: 100000
});

// 2. Create batch
const batch = await glService.createBatch({
  tenant_id: 'tenant-1',
  batch_number: 'OB-2024-001',
  batch_type: 'manual_je',
  status: 'draft',
  entry_count: 2,
  total_debit: 100000,
  total_credit: 100000,
  is_balanced: true
});

// 3. Create entries
await glService.createGLEntry({
  tenant_id: 'tenant-1',
  batch_id: batch.id,
  gl_date: '2024-01-01',
  account_id: bankAccount.id,
  debit_amount: 100000,
  credit_amount: 0,
  description: 'Opening balance'
});

await glService.createGLEntry({
  tenant_id: 'tenant-1',
  batch_id: batch.id,
  gl_date: '2024-01-01',
  account_id: equityAccount.id,
  debit_amount: 0,
  credit_amount: 100000,
  description: 'Opening capital'
});

// 4. Validate balance
const validation = await glService.validateBatchBalance(batch.id);
console.log('Balanced:', validation.isBalanced);

// 5. Post batch
await glService.postBatch(batch.id, 'user-123');

// 6. Generate trial balance
const trialBalance = await glService.getTrialBalance('tenant-1', '2024-01-01');
console.log('Trial Balance:', trialBalance);

// 7. Reverse if needed
const reversal = await glService.reverseBatch(batch.id, 'Correction', 'user-123');
```

## Integration with Other Modules

GL entries can be sourced from:
- Manual journal entries (manual_je)
- Accounts Receivable (auto_ar)
- Accounts Payable (auto_ap)
- Payroll (auto_payroll)
- Bank feeds (system)
- Data imports (import)

All entries maintain audit trails with source document references for traceability.
