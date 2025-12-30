/*
  # Core ERP Tables Migration

  ## Tables Created
  1. **customers** - Customer information
  2. **vendors** - Supplier/vendor information
  3. **purchase_orders** - Purchase orders
  4. **purchase_order_lines** - Purchase order line items
  5. **purchase_requisitions** - Purchase requisitions
  6. **delivery_notes** - Delivery notes for sales orders

  ## Business Workflows
  - Customer management
  - Vendor management
  - Purchase order lifecycle
  - Purchase requisition workflow
  - Delivery note management

  ## Security
  - RLS enabled on all tables
  - Tenant-based isolation
*/

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  tax_id TEXT,
  payment_terms TEXT DEFAULT 'Net 30',
  credit_limit NUMERIC(15,2) DEFAULT 0,
  balance NUMERIC(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view customers in their tenant"
  ON customers FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage customers in their tenant"
  ON customers FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_customers_tenant ON customers(tenant_id);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);

-- Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  tax_id TEXT,
  payment_terms TEXT DEFAULT 'Net 30',
  credit_limit NUMERIC(15,2) DEFAULT 0,
  balance NUMERIC(15,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view vendors in their tenant"
  ON vendors FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage vendors in their tenant"
  ON vendors FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_vendors_tenant ON vendors(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  po_number TEXT NOT NULL,
  vendor_id UUID NOT NULL REFERENCES vendors(id),
  requisition_id UUID,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'sent', 'received', 'invoiced', 'rejected', 'cancelled')),
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  currency TEXT DEFAULT 'KES',
  subtotal NUMERIC(15,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  tax_amount NUMERIC(15,2) DEFAULT 0,
  shipping_amount NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  requested_by TEXT,
  approved_by TEXT,
  department TEXT,
  terms TEXT,
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, po_number)
);

ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase orders in their tenant"
  ON purchase_orders FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage purchase orders in their tenant"
  ON purchase_orders FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_purchase_orders_tenant ON purchase_orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- Purchase Order Lines
CREATE TABLE IF NOT EXISTS purchase_order_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  purchase_order_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  quantity_received NUMERIC(10,2) DEFAULT 0,
  quantity_invoiced NUMERIC(10,2) DEFAULT 0,
  unit_price NUMERIC(15,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 16,
  line_total NUMERIC(15,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_po_lines_po ON purchase_order_lines(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_po_lines_product ON purchase_order_lines(product_id);

-- Purchase Requisitions
CREATE TABLE IF NOT EXISTS purchase_requisitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  req_number TEXT NOT NULL,
  requested_by TEXT NOT NULL,
  department TEXT,
  request_date DATE NOT NULL DEFAULT CURRENT_DATE,
  required_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'approved', 'ordered', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  total_estimate NUMERIC(15,2) DEFAULT 0,
  reason TEXT,
  notes TEXT,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, req_number)
);

ALTER TABLE purchase_requisitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view purchase requisitions in their tenant"
  ON purchase_requisitions FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage purchase requisitions in their tenant"
  ON purchase_requisitions FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_purchase_requisitions_tenant ON purchase_requisitions(tenant_id);
CREATE INDEX IF NOT EXISTS idx_purchase_requisitions_status ON purchase_requisitions(status);

-- Delivery Notes
CREATE TABLE IF NOT EXISTS delivery_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  delivery_number TEXT NOT NULL,
  sales_order_id UUID REFERENCES sales_orders(id),
  customer_id UUID REFERENCES customers(id),
  delivery_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_transit', 'delivered', 'cancelled')),
  driver TEXT,
  vehicle TEXT,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, delivery_number)
);

ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view delivery notes in their tenant"
  ON delivery_notes FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage delivery notes in their tenant"
  ON delivery_notes FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_delivery_notes_tenant ON delivery_notes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_order ON delivery_notes(sales_order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_date ON delivery_notes(delivery_date);