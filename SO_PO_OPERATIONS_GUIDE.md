# Sales Orders & Purchase Orders - Complete Operations Guide

## Overview
Comprehensive implementation of Sales Order (SO) and Purchase Order (PO) management systems with full CRUD operations, approval workflows, inventory integration, and financial tracking.

## Service Layers

### Sales Order Service: `src/services/sales-order.service.ts`

#### Core CRUD Operations

**Create Sales Order**
```typescript
const order = await salesOrderService.createOrder({
  tenant_id: 'tenant-id',
  order_number: 'SO-001',
  customer_id: 'customer-id',
  order_date: '2024-11-13',
  delivery_date: '2024-11-20',
  status: 'draft',
  payment_status: 'unpaid',
  fulfillment_status: 'pending',
  subtotal: 5000,
  discount_amount: 0,
  tax_amount: 800,
  total: 5800,
  currency: 'KES'
});
```

**Get All Sales Orders**
```typescript
// Basic retrieval
const orders = await salesOrderService.getOrders(tenantId);

// With filters
const orders = await salesOrderService.getOrders(tenantId, {
  status: 'confirmed',
  customerId: 'customer-id',
  dateRange: ['2024-01-01', '2024-12-31'],
  paymentStatus: 'unpaid'
});
```

**Get Single Order with Details**
```typescript
const order = await salesOrderService.getOrderById(orderId);
// Returns: order + customer details + all line items
```

**Update Order**
```typescript
const updated = await salesOrderService.updateOrder(orderId, {
  status: 'processing',
  internal_notes: 'Rush order'
});
```

**Delete Order**
```typescript
// Only draft orders can be deleted
await salesOrderService.deleteOrder(orderId);
```

#### Line Item Management

**Add Line Item**
```typescript
const line = await salesOrderService.createOrderLine({
  order_id: 'order-id',
  product_id: 'product-id',
  line_number: 1,
  description: 'Product name',
  quantity: 10,
  unit_price: 500,
  discount_percentage: 5,
  tax_rate: 16,
  line_total: 4750
});
```

**Get Order Lines**
```typescript
const lines = await salesOrderService.getOrderLines(orderId);
```

**Update Line Item**
```typescript
const updated = await salesOrderService.updateOrderLine(lineId, {
  quantity: 15,
  unit_price: 550
});
```

**Delete Line Item**
```typescript
await salesOrderService.deleteOrderLine(lineId);
```

#### Workflow Operations

**Confirm Order**
```typescript
const confirmed = await salesOrderService.confirmOrder(orderId, userId);
// Updates status to 'confirmed' and sets confirmed_at timestamp
```

**Hold Order**
```typescript
const held = await salesOrderService.holdOrder(orderId, 'Customer requested hold');
// Status changes to 'on_hold'
```

**Cancel Order**
```typescript
const cancelled = await salesOrderService.cancelOrder(orderId, 'Customer cancelled');
// Status changes to 'cancelled'
```

#### Analysis & Reporting

**Get Orders by Customer**
```typescript
const customerOrders = await salesOrderService.getOrdersByCustomer(customerId, tenantId);
```

**Get Orders by Status**
```typescript
const confirmedOrders = await salesOrderService.getOrdersByStatus('confirmed', tenantId);
```

**Calculate Order Totals**
```typescript
const totals = await salesOrderService.calculateOrderTotals(orderId);
// Returns: { subtotal, tax_amount, total, line_count }
```

**Get Orders Summary**
```typescript
const summary = await salesOrderService.getOrdersSummary(tenantId);
// Groups by status with count and total amount
```

**Get Metrics**
```typescript
const metrics = await salesOrderService.getOrderMetrics(tenantId, ['2024-01-01', '2024-12-31']);
// Returns: {
//   total_orders: number,
//   total_revenue: number,
//   confirmed_count: number,
//   pending_payment: number
// }
```

**Convert Quote to Order**
```typescript
const converted = await salesOrderService.convertQuoteToOrder(quoteId, orderId);
```

---

### Purchase Order Service: `src/services/purchase-order.service.ts`

#### Core CRUD Operations

**Create Purchase Order**
```typescript
const po = await purchaseOrderService.createOrder({
  tenant_id: 'tenant-id',
  po_number: 'PO-001',
  vendor_id: 'vendor-id',
  po_date: '2024-11-13',
  delivery_date: '2024-11-20',
  status: 'draft',
  approval_status: 'pending',
  subtotal: 2000,
  tax_amount: 320,
  total: 2320,
  payment_terms: 'net_30'
});
```

**Get All Purchase Orders**
```typescript
// Basic retrieval
const orders = await purchaseOrderService.getOrders(tenantId);

// With filters
const orders = await purchaseOrderService.getOrders(tenantId, {
  status: 'approved',
  vendorId: 'vendor-id',
  approvalStatus: 'pending',
  dateRange: ['2024-01-01', '2024-12-31']
});
```

**Get Single Order**
```typescript
const po = await purchaseOrderService.getOrderById(poId);
// Returns: PO + vendor details + all line items
```

**Update Order**
```typescript
const updated = await purchaseOrderService.updateOrder(poId, {
  delivery_date: '2024-11-25',
  internal_notes: 'Updated delivery date'
});
```

**Delete Order**
```typescript
await purchaseOrderService.deleteOrder(poId);
```

#### Approval Workflow

**Approve Purchase Order**
```typescript
const approved = await purchaseOrderService.approveOrder(poId, userId);
// Updates approval_status to 'approved', sets approved_by and approved_at
```

**Reject Purchase Order**
```typescript
const rejected = await purchaseOrderService.rejectOrder(poId, userId, 'Reject reason');
// Updates status to 'rejected'
```

**Send Purchase Order**
```typescript
const sent = await purchaseOrderService.sendOrder(poId);
// Updates status to 'sent' and sets sent_at timestamp
```

#### Line Item Management

**Add Line Item**
```typescript
const line = await purchaseOrderService.createOrderLine({
  po_id: 'po-id',
  line_number: 1,
  product_id: 'product-id',
  description: 'Item description',
  quantity: 50,
  unit_price: 100,
  tax_rate: 16,
  line_total: 5800
});
```

**Get PO Lines**
```typescript
const lines = await purchaseOrderService.getOrderLines(poId);
```

**Update Line Item**
```typescript
const updated = await purchaseOrderService.updateOrderLine(lineId, {
  quantity: 75,
  quantity_received: 25
});
```

**Delete Line Item**
```typescript
await purchaseOrderService.deleteOrderLine(lineId);
```

#### Goods Receipt Management

**Create Purchase Receipt**
```typescript
const receipt = await purchaseOrderService.createPurchaseReceipt({
  tenant_id: 'tenant-id',
  receipt_number: 'GR-001',
  po_id: 'po-id',
  receipt_date: '2024-11-20',
  status: 'draft',
  quality_status: 'pending',
  warehouse_id: 'warehouse-id'
});
```

**Get Receipts by PO**
```typescript
const receipts = await purchaseOrderService.getReceiptsByOrder(poId);
```

**Update Receipt Status**
```typescript
const updated = await purchaseOrderService.updateReceiptStatus(
  receiptId,
  'accepted',
  'passed' // quality_status
);
```

#### Vendor Invoice Management

**Create Vendor Invoice**
```typescript
const invoice = await purchaseOrderService.createVendorInvoice({
  tenant_id: 'tenant-id',
  invoice_number: 'INV-001',
  vendor_id: 'vendor-id',
  po_id: 'po-id',
  invoice_date: '2024-11-20',
  due_date: '2024-12-20',
  status: 'received',
  match_status: 'unmatched',
  total: 2320
});
```

**Get Vendor Invoices**
```typescript
const invoices = await purchaseOrderService.getVendorInvoices(tenantId, {
  status: 'received',
  matchStatus: 'unmatched',
  vendorId: 'vendor-id'
});
```

**Approve Vendor Invoice**
```typescript
const approved = await purchaseOrderService.approveVendorInvoice(invoiceId, userId);
```

**Match Invoice to PO (Three-Way Match)**
```typescript
const matched = await purchaseOrderService.matchVendorInvoice(invoiceId, poId);
// Validates: PO Quantity = Receipt Quantity = Invoice Quantity
```

#### Analysis & Reporting

**Get Orders by Vendor**
```typescript
const vendorPOs = await purchaseOrderService.getOrdersByVendor(vendorId, tenantId);
```

**Get Orders by Status**
```typescript
const approvedPOs = await purchaseOrderService.getOrdersByStatus('approved', tenantId);
```

**Get Pending Approvals**
```typescript
const pending = await purchaseOrderService.getPendingApproval(tenantId);
```

**Calculate Order Totals**
```typescript
const totals = await purchaseOrderService.calculateOrderTotals(poId);
// Returns: { subtotal, tax_amount, total, line_count }
```

**Get Receipt Status**
```typescript
const status = await purchaseOrderService.getReceiptStatus(poId);
// Returns: {
//   total_quantity,
//   received_quantity,
//   pending_quantity,
//   receipt_percentage
// }
```

**Get PO Metrics**
```typescript
const metrics = await purchaseOrderService.getPOMetrics(tenantId, ['2024-01-01', '2024-12-31']);
// Returns: {
//   total_orders: number,
//   total_spend: number,
//   approved_count: number,
//   pending_approval: number
// }
```

**Get Orders Summary**
```typescript
const summary = await purchaseOrderService.getOrdersSummary(tenantId);
// Groups by status with count and total amount
```

#### Requisition Management

**Create Requisition**
```typescript
const req = await purchaseOrderService.createRequisition({
  tenant_id: 'tenant-id',
  requisition_number: 'PR-001',
  requester_id: 'user-id',
  requisition_date: '2024-11-13',
  needed_by_date: '2024-11-20',
  status: 'draft',
  department: 'Operations'
});
```

**Get Requisitions**
```typescript
const reqs = await purchaseOrderService.getRequisitions(tenantId, {
  status: 'approved'
});
```

**Convert Requisition to PO**
```typescript
const converted = await purchaseOrderService.convertRequisitionToOrder(reqId, poId);
```

---

## UI Components

### Sales Order Components: `src/components/SO/`

**SalesOrdersList**
- Display all SO with filters
- Search by order number or customer
- Filter by status, payment status
- View, edit, delete actions
- Statistics dashboard

**SalesOrderForm**
- Create/edit SO
- Add/remove line items
- Calculate totals automatically
- Support for discounts and tax
- Customer selection
- Date selection

### Purchase Order Components: `src/components/PO/`

**PurchaseOrdersList**
- Display all POs with filters
- Search by PO number or vendor
- Filter by status, approval status
- View, edit, delete, approve actions
- Statistics dashboard

**PurchaseOrderForm**
- Create/edit PO
- Add/remove line items
- Auto-calculate totals
- Vendor selection
- Payment terms selection
- Shipping method selection

---

## Database Schema

### Sales Order Tables

**sales_orders**
- Order header with customer, dates, status
- Payment and fulfillment tracking
- Billing and shipping addresses (JSONB)
- Approval workflow fields

**sales_order_lines**
- Individual line items
- Quantity, pricing, discounts, tax
- Inventory reservation tracking
- Fulfillment tracking

**sales_quotes**
- Quotation management
- Quote to order conversion tracking

**shipments**
- Delivery/shipment tracking
- Carrier and tracking information

**rma_returns**
- Return merchandise authorization
- Refund and replacement handling

### Purchase Order Tables

**purchase_orders**
- PO header with vendor, dates, status
- Approval and receipt status tracking
- Payment terms and shipping info

**purchase_order_lines**
- Line items with received quantities
- Tax and pricing details

**purchase_requisitions**
- Internal purchase requests
- Approval workflow
- Requisition to PO conversion

**supplier_quotations**
- RFQ responses from vendors
- Selection for PO creation

**purchase_receipts**
- Goods received notes
- Quality inspection status
- Received by user and timestamp

**purchase_receipt_lines**
- Received quantities and acceptance
- Condition and disposition tracking

**vendor_invoices**
- Vendor billing documents
- Three-way match status
- Invoice to payment tracking

**vendor_invoice_lines**
- Individual invoice items
- Variance tracking for price mismatches

---

## Complete Workflow Examples

### Sales Order Workflow

```typescript
// 1. Create SO
const order = await salesOrderService.createOrder({
  order_number: 'SO-001',
  customer_id: 'cust-123',
  order_date: '2024-11-13',
  status: 'draft'
});

// 2. Add line items
await salesOrderService.createOrderLine({
  order_id: order.id,
  description: 'Product A',
  quantity: 10,
  unit_price: 500,
  tax_rate: 16
});

// 3. Confirm order
await salesOrderService.confirmOrder(order.id, userId);

// 4. Track fulfillment (via shipments table)
// - Create shipment when goods ready
// - Update shipment status as it moves

// 5. Convert to invoice when fulfilled
// - Invoice system will reference SO

// 6. Get metrics
const metrics = await salesOrderService.getOrderMetrics(tenantId);
```

### Purchase Order Workflow

```typescript
// 1. Create requisition
const req = await purchaseOrderService.createRequisition({
  requisition_number: 'PR-001',
  department: 'Operations',
  needed_by_date: '2024-11-20'
});

// 2. Create PO from requisition
const po = await purchaseOrderService.createOrder({
  po_number: 'PO-001',
  vendor_id: 'vendor-123',
  requisition_id: req.id
});

// 3. Add line items
await purchaseOrderService.createOrderLine({
  po_id: po.id,
  description: 'Office supplies',
  quantity: 100,
  unit_price: 50
});

// 4. Submit for approval
await purchaseOrderService.updateOrder(po.id, { status: 'submitted' });

// 5. Approve
await purchaseOrderService.approveOrder(po.id, approverId);

// 6. Send to vendor
await purchaseOrderService.sendOrder(po.id);

// 7. Receive goods
const receipt = await purchaseOrderService.createPurchaseReceipt({
  po_id: po.id,
  receipt_number: 'GR-001'
});

// 8. Quality inspection
await purchaseOrderService.updateReceiptStatus(receipt.id, 'inspection', 'pending');
await purchaseOrderService.updateReceiptStatus(receipt.id, 'accepted', 'passed');

// 9. Receive invoice
const invoice = await purchaseOrderService.createVendorInvoice({
  po_id: po.id,
  invoice_number: 'INV-001'
});

// 10. Three-way match
await purchaseOrderService.matchVendorInvoice(invoice.id, po.id);

// 11. Approve for payment
await purchaseOrderService.approveVendorInvoice(invoice.id, userId);
```

---

## Key Features

### Sales Order Features
✓ Multi-line order management
✓ Automatic total calculations
✓ Customer-based filtering
✓ Payment status tracking
✓ Fulfillment status tracking
✓ Quote to order conversion
✓ Discount and tax support
✓ Order hold and cancellation
✓ Customer order history
✓ Revenue analytics

### Purchase Order Features
✓ Multi-step approval workflow
✓ Requisition to PO conversion
✓ Vendor management
✓ Goods receipt tracking
✓ Quality inspection workflow
✓ Three-way invoice matching
✓ Payment terms management
✓ Budget tracking
✓ Vendor analytics
✓ Spend analysis

### Integration Points
✓ Inventory reservation (SO)
✓ Inventory receipt (PO)
✓ Accounting GL integration
✓ AR/AP system integration
✓ Customer credit checking
✓ Vendor payment terms

---

## Security & Compliance

- RLS policies by tenant_id
- User audit trails (created_by, updated_by)
- Approval workflow tracking
- Immutable posted records
- Approval signatures and timestamps
- Three-way match validation
- Budget enforcement
- Vendor approval status

---

## Error Handling

```typescript
try {
  await purchaseOrderService.approveOrder(poId, userId);
} catch (error) {
  if (error.message.includes('already approved')) {
    console.error('PO already approved');
  }
  if (error.message.includes('Insufficient permissions')) {
    console.error('User cannot approve');
  }
}
```

All operations include proper error handling with meaningful messages for UI feedback.
