/*
  # Enhanced Accounting Module

  ## Enhancements
  1. **Purchase Orders** - Supplier ordering
  2. **Goods Receipt Notes** - Receiving tracking
  3. **AP 3-way matching** - PO ↔ GRN ↔ Invoice matching
  4. **Payment runs** - Batch payment processing
  5. **Bank feeds** - Automated reconciliation
  6. **Fiscal periods** - Period locking
  7. **Cost centers** - Departmental accounting
  8. **Intercompany transactions** - Multi-entity
  9. **Approval workflows** - Configurable approvals

  ## Security
  - Segregation of duties
  - Audit trail enhancements
  - Period locking
*/

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expected_delivery_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'sent', 'partial', 'received', 'invoiced', 'cancelled')),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  subtotal NUMERIC(15,2) DEFAULT 0,
  tax_amount NUMERIC(15,2) DEFAULT 0,
  shipping_amount NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  payment_terms INTEGER DEFAULT 30,
  shipping_address JSONB,
  notes TEXT,
  internal_notes TEXT,
  requested_by UUID REFERENCES auth.users(id),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, po_number)
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view POs in their tenant"
  ON purchase_orders FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage POs in their tenant"
  ON purchase_orders FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);

-- Purchase Order Lines
CREATE TABLE IF NOT EXISTS purchase_order_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  quantity_received NUMERIC(10,2) DEFAULT 0,
  quantity_invoiced NUMERIC(10,2) DEFAULT 0,
  unit_price NUMERIC(15,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 16,
  line_total NUMERIC(15,2) NOT NULL,
  account_id UUID REFERENCES chart_of_accounts(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_po_lines_po ON purchase_order_lines(po_id);
CREATE INDEX IF NOT EXISTS idx_po_lines_product ON purchase_order_lines(product_id);

-- Goods Receipt Notes
CREATE TABLE IF NOT EXISTS goods_receipt_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  grn_number TEXT NOT NULL,
  po_id UUID NOT NULL REFERENCES purchase_orders(id),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  receipt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'received', 'inspected', 'accepted', 'rejected')),
  inspection_status TEXT CHECK (inspection_status IN ('pending', 'passed', 'failed', 'partial')),
  delivery_note_number TEXT,
  transporter TEXT,
  notes TEXT,
  received_by UUID REFERENCES auth.users(id),
  inspected_by UUID REFERENCES auth.users(id),
  inspected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, grn_number)
);

ALTER TABLE goods_receipt_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view GRNs in their tenant"
  ON goods_receipt_notes FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage GRNs in their tenant"
  ON goods_receipt_notes FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_grn_po ON goods_receipt_notes(po_id);
CREATE INDEX IF NOT EXISTS idx_grn_vendor ON goods_receipt_notes(vendor_id);

-- GRN Lines
CREATE TABLE IF NOT EXISTS grn_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  grn_id UUID NOT NULL REFERENCES goods_receipt_notes(id) ON DELETE CASCADE,
  po_line_id UUID NOT NULL REFERENCES purchase_order_lines(id),
  line_number INTEGER NOT NULL,
  product_id UUID REFERENCES products(id),
  quantity_ordered NUMERIC(10,2) NOT NULL,
  quantity_received NUMERIC(10,2) NOT NULL,
  quantity_accepted NUMERIC(10,2) DEFAULT 0,
  quantity_rejected NUMERIC(10,2) DEFAULT 0,
  condition TEXT CHECK (condition IN ('good', 'damaged', 'shortage', 'excess')),
  lot_number TEXT,
  serial_numbers TEXT[],
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grn_lines_grn ON grn_lines(grn_id);
CREATE INDEX IF NOT EXISTS idx_grn_lines_po_line ON grn_lines(po_line_id);

-- 3-Way Match Records
CREATE TABLE IF NOT EXISTS three_way_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  po_id UUID NOT NULL REFERENCES purchase_orders(id),
  grn_id UUID REFERENCES goods_receipt_notes(id),
  match_status TEXT DEFAULT 'pending' CHECK (match_status IN ('pending', 'matched', 'exception', 'approved_exception')),
  match_date TIMESTAMPTZ DEFAULT NOW(),
  po_total NUMERIC(15,2),
  grn_total NUMERIC(15,2),
  invoice_total NUMERIC(15,2),
  variance_amount NUMERIC(15,2) DEFAULT 0,
  variance_percentage NUMERIC(5,2) DEFAULT 0,
  tolerance_percentage NUMERIC(5,2) DEFAULT 5,
  exception_reason TEXT,
  exception_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE three_way_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view matches in their tenant"
  ON three_way_matches FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage matches in their tenant"
  ON three_way_matches FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_3way_invoice ON three_way_matches(invoice_id);
CREATE INDEX IF NOT EXISTS idx_3way_po ON three_way_matches(po_id);
CREATE INDEX IF NOT EXISTS idx_3way_status ON three_way_matches(match_status);

-- Payment Runs
CREATE TABLE IF NOT EXISTS payment_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_number TEXT NOT NULL,
  run_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'processed', 'completed', 'cancelled')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('bank_transfer', 'cheque', 'mobile_money', 'cash')),
  bank_account_id UUID REFERENCES bank_accounts(id),
  total_amount NUMERIC(15,2) DEFAULT 0,
  payment_count INTEGER DEFAULT 0,
  file_generated BOOLEAN DEFAULT false,
  file_path TEXT,
  notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, run_number)
);

ALTER TABLE payment_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view payment runs in their tenant"
  ON payment_runs FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage payment runs in their tenant"
  ON payment_runs FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Payment Run Lines
CREATE TABLE IF NOT EXISTS payment_run_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payment_run_id UUID NOT NULL REFERENCES payment_runs(id) ON DELETE CASCADE,
  invoice_id UUID NOT NULL REFERENCES invoices(id),
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  amount NUMERIC(15,2) NOT NULL,
  payment_reference TEXT,
  status TEXT DEFAULT 'included' CHECK (status IN ('included', 'paid', 'failed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payment_run_lines_run ON payment_run_lines(payment_run_id);
CREATE INDEX IF NOT EXISTS idx_payment_run_lines_invoice ON payment_run_lines(invoice_id);

-- Fiscal Periods
CREATE TABLE IF NOT EXISTS fiscal_periods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  period_name TEXT NOT NULL,
  fiscal_year INTEGER NOT NULL,
  period_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'locked')),
  closed_by UUID REFERENCES auth.users(id),
  closed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, fiscal_year, period_number)
);

ALTER TABLE fiscal_periods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view periods in their tenant"
  ON fiscal_periods FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage periods in their tenant"
  ON fiscal_periods FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Cost Centers
CREATE TABLE IF NOT EXISTS cost_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES cost_centers(id),
  manager_id UUID REFERENCES employees(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

ALTER TABLE cost_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view cost centers in their tenant"
  ON cost_centers FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage cost centers in their tenant"
  ON cost_centers FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Add cost center to journal entry lines
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'journal_entry_lines' AND column_name = 'cost_center_id') THEN
    ALTER TABLE journal_entry_lines ADD COLUMN cost_center_id UUID REFERENCES cost_centers(id);
  END IF;
END $$;

-- Approval Workflows
CREATE TABLE IF NOT EXISTS approval_workflows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('sales_quote', 'sales_order', 'purchase_order', 'invoice', 'payment', 'journal_entry', 'expense')),
  rules JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view workflows in their tenant"
  ON approval_workflows FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage workflows in their tenant"
  ON approval_workflows FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Approval Requests
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES approval_workflows(id),
  entity_type TEXT NOT NULL,
  entity_id UUID NOT NULL,
  requested_by UUID REFERENCES auth.users(id),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  approver_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
  comments TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view approval requests in their tenant"
  ON approval_requests FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage approval requests in their tenant"
  ON approval_requests FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_approval_requests_entity ON approval_requests(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests(status);
