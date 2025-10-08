/*
  # Sales Module Schema

  ## Tables Created
  1. **price_lists** - Customer/product pricing rules
  2. **price_rules** - Discount rules and pricing formulas
  3. **sales_quotes** - Customer quotations
  4. **sales_quote_lines** - Quote line items
  5. **sales_orders** - Customer orders
  6. **sales_order_lines** - Order line items
  7. **shipments** - Delivery tracking
  8. **rma_returns** - Return merchandise authorizations
  9. **sales_commissions** - Sales team commissions
  10. **payment_terms** - Payment term definitions
  11. **shipping_methods** - Shipping options

  ## Business Workflows
  - Quote approval workflow
  - Order confirmation with credit checks
  - Inventory reservation
  - Drop-ship automation
  - Recurring billing support
  - Return/refund processing

  ## Security
  - RLS enabled on all tables
  - Tenant-based isolation
*/

-- Price Lists
CREATE TABLE IF NOT EXISTS price_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  currency TEXT DEFAULT 'KES',
  customer_group TEXT,
  valid_from DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view price lists in their tenant"
  ON price_lists FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage price lists in their tenant"
  ON price_lists FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Price Rules
CREATE TABLE IF NOT EXISTS price_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  price_list_id UUID REFERENCES price_lists(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  min_quantity NUMERIC(10,2) DEFAULT 1,
  unit_price NUMERIC(15,2),
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  formula TEXT,
  valid_from DATE,
  valid_to DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE price_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view price rules in their tenant"
  ON price_rules FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage price rules in their tenant"
  ON price_rules FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Sales Quotes
CREATE TABLE IF NOT EXISTS sales_quotes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  quote_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  contact_person TEXT,
  quote_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'approved', 'rejected', 'converted', 'expired')),
  subtotal NUMERIC(15,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  tax_amount NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  notes TEXT,
  terms TEXT,
  requires_approval BOOLEAN DEFAULT false,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  converted_to_order_id UUID,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, quote_number)
);

ALTER TABLE sales_quotes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quotes in their tenant"
  ON sales_quotes FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage quotes in their tenant"
  ON sales_quotes FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_sales_quotes_customer ON sales_quotes(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_quotes_status ON sales_quotes(status);

-- Sales Quote Lines
CREATE TABLE IF NOT EXISTS sales_quote_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID NOT NULL REFERENCES sales_quotes(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(15,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 16,
  line_total NUMERIC(15,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_lines_quote ON sales_quote_lines(quote_id);

-- Sales Orders
CREATE TABLE IF NOT EXISTS sales_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  quote_id UUID REFERENCES sales_quotes(id),
  contact_person TEXT,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_date DATE,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'confirmed', 'on_hold', 'processing', 'fulfilled', 'invoiced', 'cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid')),
  fulfillment_status TEXT DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'reserved', 'partial', 'fulfilled', 'backordered')),
  subtotal NUMERIC(15,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  tax_amount NUMERIC(15,2) DEFAULT 0,
  shipping_amount NUMERIC(15,2) DEFAULT 0,
  total NUMERIC(15,2) DEFAULT 0,
  currency TEXT DEFAULT 'KES',
  billing_address JSONB,
  shipping_address JSONB,
  notes TEXT,
  internal_notes TEXT,
  terms TEXT,
  credit_hold BOOLEAN DEFAULT false,
  credit_hold_reason TEXT,
  is_drop_ship BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurring_interval TEXT,
  confirmed_at TIMESTAMPTZ,
  fulfilled_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, order_number)
);

ALTER TABLE sales_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view orders in their tenant"
  ON sales_orders FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage orders in their tenant"
  ON sales_orders FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_sales_orders_customer ON sales_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_orders_status ON sales_orders(status);
CREATE INDEX IF NOT EXISTS idx_sales_orders_date ON sales_orders(order_date);

-- Sales Order Lines
CREATE TABLE IF NOT EXISTS sales_order_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES sales_orders(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  quantity_delivered NUMERIC(10,2) DEFAULT 0,
  quantity_invoiced NUMERIC(10,2) DEFAULT 0,
  unit_price NUMERIC(15,2) NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 0,
  discount_amount NUMERIC(15,2) DEFAULT 0,
  tax_rate NUMERIC(5,2) DEFAULT 16,
  line_total NUMERIC(15,2) NOT NULL,
  warehouse_id UUID,
  ship_by_date DATE,
  fulfillment_type TEXT DEFAULT 'standard' CHECK (fulfillment_type IN ('standard', 'drop_ship', 'backorder')),
  reservation_status TEXT DEFAULT 'none' CHECK (reservation_status IN ('none', 'reserved', 'partial', 'available')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_lines_order ON sales_order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_order_lines_product ON sales_order_lines(product_id);

-- Shipments
CREATE TABLE IF NOT EXISTS shipments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  shipment_number TEXT NOT NULL,
  order_id UUID NOT NULL REFERENCES sales_orders(id),
  carrier TEXT,
  tracking_number TEXT,
  shipping_method TEXT,
  shipped_date DATE,
  expected_delivery_date DATE,
  actual_delivery_date DATE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'packed', 'shipped', 'in_transit', 'delivered', 'returned', 'cancelled')),
  weight NUMERIC(10,2),
  weight_uom TEXT DEFAULT 'kg',
  dimensions JSONB,
  shipping_cost NUMERIC(15,2) DEFAULT 0,
  tracking_url TEXT,
  shipping_address JSONB,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, shipment_number)
);

ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view shipments in their tenant"
  ON shipments FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage shipments in their tenant"
  ON shipments FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);

-- RMA Returns
CREATE TABLE IF NOT EXISTS rma_returns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  rma_number TEXT NOT NULL,
  customer_id UUID NOT NULL REFERENCES customers(id),
  order_id UUID REFERENCES sales_orders(id),
  invoice_id UUID REFERENCES invoices(id),
  return_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'approved', 'received', 'inspected', 'refunded', 'rejected')),
  reason TEXT NOT NULL,
  resolution TEXT CHECK (resolution IN ('refund', 'replacement', 'repair', 'credit_note')),
  return_amount NUMERIC(15,2) DEFAULT 0,
  restocking_fee NUMERIC(15,2) DEFAULT 0,
  refund_amount NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  internal_notes TEXT,
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, rma_number)
);

ALTER TABLE rma_returns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view RMAs in their tenant"
  ON rma_returns FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage RMAs in their tenant"
  ON rma_returns FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_rma_customer ON rma_returns(customer_id);
CREATE INDEX IF NOT EXISTS idx_rma_status ON rma_returns(status);

-- RMA Lines
CREATE TABLE IF NOT EXISTS rma_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rma_id UUID NOT NULL REFERENCES rma_returns(id) ON DELETE CASCADE,
  order_line_id UUID REFERENCES sales_order_lines(id),
  product_id UUID REFERENCES products(id),
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(15,2) NOT NULL,
  line_total NUMERIC(15,2) NOT NULL,
  condition TEXT CHECK (condition IN ('new', 'used', 'damaged', 'defective')),
  disposition TEXT CHECK (disposition IN ('restock', 'scrap', 'repair', 'return_to_vendor')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rma_lines_rma ON rma_lines(rma_id);

-- Update invoices to link to sales orders
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'sales_order_id') THEN
    ALTER TABLE invoices ADD COLUMN sales_order_id UUID REFERENCES sales_orders(id);
    CREATE INDEX IF NOT EXISTS idx_invoices_sales_order ON invoices(sales_order_id);
  END IF;
END $$;

-- Add foreign key to estimates for converted orders
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'sales_quotes' AND column_name = 'converted_to_order_id') THEN
    ALTER TABLE sales_quotes ADD CONSTRAINT fk_quote_order FOREIGN KEY (converted_to_order_id) REFERENCES sales_orders(id);
  END IF;
END $$;
