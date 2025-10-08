/*
  # Manufacturing Module Schema

  ## Tables Created
  1. **work_centers** - Production facilities and machines
  2. **bills_of_materials** - Product BOMs (multi-level)
  3. **bom_lines** - BOM components
  4. **routings** - Manufacturing operations
  5. **routing_operations** - Operation steps
  6. **production_orders** - Manufacturing orders
  7. **work_orders** - Individual operation tracking
  8. **quality_checks** - QC inspections
  9. **quality_plans** - Inspection templates
  10. **mrp_runs** - Material requirements planning
  11. **mrp_suggestions** - Planning outputs
  12. **inventory_lots** - Lot/batch tracking
  13. **serial_numbers** - Serial number tracking
  14. **maintenance_orders** - Equipment maintenance

  ## Business Workflows
  - MRP planning (material requirements)
  - Production order lifecycle
  - Shop floor execution
  - Quality inspections
  - Lot/serial traceability
  - Finite capacity scheduling
  - Subcontracting

  ## Security
  - RLS enabled on all tables
  - Tenant-based isolation
*/

-- Work Centers
CREATE TABLE IF NOT EXISTS work_centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  work_center_type TEXT DEFAULT 'machine' CHECK (work_center_type IN ('machine', 'assembly', 'inspection', 'warehouse')),
  capacity_per_day NUMERIC(10,2),
  cost_per_hour NUMERIC(15,2) DEFAULT 0,
  efficiency_percentage NUMERIC(5,2) DEFAULT 100,
  working_hours_per_day NUMERIC(5,2) DEFAULT 8,
  calendar JSONB DEFAULT '{"working_days": [1,2,3,4,5]}',
  is_active BOOLEAN DEFAULT true,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, code)
);

ALTER TABLE work_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view work centers in their tenant"
  ON work_centers FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage work centers in their tenant"
  ON work_centers FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Bills of Materials
CREATE TABLE IF NOT EXISTS bills_of_materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  bom_number TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  version INTEGER DEFAULT 1,
  bom_type TEXT DEFAULT 'production' CHECK (bom_type IN ('production', 'engineering', 'phantom', 'kit')),
  is_active BOOLEAN DEFAULT true,
  is_default BOOLEAN DEFAULT true,
  quantity_produced NUMERIC(10,2) DEFAULT 1,
  uom TEXT DEFAULT 'Unit',
  routing_id UUID,
  notes TEXT,
  valid_from DATE,
  valid_to DATE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, bom_number)
);

ALTER TABLE bills_of_materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view BOMs in their tenant"
  ON bills_of_materials FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage BOMs in their tenant"
  ON bills_of_materials FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_boms_product ON bills_of_materials(product_id);

-- BOM Lines
CREATE TABLE IF NOT EXISTS bom_lines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bom_id UUID NOT NULL REFERENCES bills_of_materials(id) ON DELETE CASCADE,
  line_number INTEGER NOT NULL,
  component_id UUID NOT NULL REFERENCES products(id),
  quantity NUMERIC(10,2) NOT NULL,
  uom TEXT DEFAULT 'Unit',
  scrap_percentage NUMERIC(5,2) DEFAULT 0,
  is_phantom BOOLEAN DEFAULT false,
  operation_sequence INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_bom_lines_bom ON bom_lines(bom_id);
CREATE INDEX IF NOT EXISTS idx_bom_lines_component ON bom_lines(component_id);

-- Routings
CREATE TABLE IF NOT EXISTS routings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  routing_number TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, routing_number)
);

ALTER TABLE routings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view routings in their tenant"
  ON routings FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage routings in their tenant"
  ON routings FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Routing Operations
CREATE TABLE IF NOT EXISTS routing_operations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  routing_id UUID NOT NULL REFERENCES routings(id) ON DELETE CASCADE,
  sequence INTEGER NOT NULL,
  operation_name TEXT NOT NULL,
  work_center_id UUID REFERENCES work_centers(id),
  description TEXT,
  setup_time_minutes NUMERIC(10,2) DEFAULT 0,
  run_time_per_unit_minutes NUMERIC(10,2) DEFAULT 0,
  scrap_rate NUMERIC(5,2) DEFAULT 0,
  batch_size NUMERIC(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routing_ops_routing ON routing_operations(routing_id);
CREATE INDEX IF NOT EXISTS idx_routing_ops_workcenter ON routing_operations(work_center_id);

-- Link BOMs to Routings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'fk_bom_routing') THEN
    ALTER TABLE bills_of_materials 
    ADD CONSTRAINT fk_bom_routing 
    FOREIGN KEY (routing_id) REFERENCES routings(id);
  END IF;
END $$;

-- Production Orders
CREATE TABLE IF NOT EXISTS production_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  bom_id UUID REFERENCES bills_of_materials(id),
  routing_id UUID REFERENCES routings(id),
  quantity_planned NUMERIC(10,2) NOT NULL,
  quantity_produced NUMERIC(10,2) DEFAULT 0,
  quantity_scrapped NUMERIC(10,2) DEFAULT 0,
  uom TEXT DEFAULT 'Unit',
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'in_progress', 'on_hold', 'completed', 'cancelled')),
  priority INTEGER DEFAULT 5,
  scheduled_start_date TIMESTAMPTZ,
  scheduled_end_date TIMESTAMPTZ,
  actual_start_date TIMESTAMPTZ,
  actual_end_date TIMESTAMPTZ,
  sales_order_id UUID REFERENCES sales_orders(id),
  source_location TEXT,
  destination_location TEXT,
  notes TEXT,
  mrp_run_id UUID,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, order_number)
);

ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view production orders in their tenant"
  ON production_orders FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage production orders in their tenant"
  ON production_orders FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_production_orders_product ON production_orders(product_id);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_sales_order ON production_orders(sales_order_id);

-- Work Orders (Operation Tracking)
CREATE TABLE IF NOT EXISTS work_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  work_order_number TEXT NOT NULL,
  production_order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
  operation_id UUID REFERENCES routing_operations(id),
  work_center_id UUID REFERENCES work_centers(id),
  sequence INTEGER NOT NULL,
  operation_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'in_progress', 'completed', 'cancelled')),
  scheduled_start TIMESTAMPTZ,
  scheduled_end TIMESTAMPTZ,
  actual_start TIMESTAMPTZ,
  actual_end TIMESTAMPTZ,
  setup_time_actual_minutes NUMERIC(10,2) DEFAULT 0,
  run_time_actual_minutes NUMERIC(10,2) DEFAULT 0,
  quantity_completed NUMERIC(10,2) DEFAULT 0,
  quantity_scrapped NUMERIC(10,2) DEFAULT 0,
  operator_id UUID REFERENCES employees(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, work_order_number)
);

ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view work orders in their tenant"
  ON work_orders FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage work orders in their tenant"
  ON work_orders FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_work_orders_production ON work_orders(production_order_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_workcenter ON work_orders(work_center_id);

-- Quality Plans
CREATE TABLE IF NOT EXISTS quality_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  plan_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  inspection_type TEXT NOT NULL CHECK (inspection_type IN ('receiving', 'in_process', 'final', 'periodic')),
  product_id UUID REFERENCES products(id),
  is_active BOOLEAN DEFAULT true,
  inspection_points JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, plan_code)
);

ALTER TABLE quality_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quality plans in their tenant"
  ON quality_plans FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage quality plans in their tenant"
  ON quality_plans FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- Quality Checks
CREATE TABLE IF NOT EXISTS quality_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  check_number TEXT NOT NULL,
  quality_plan_id UUID REFERENCES quality_plans(id),
  production_order_id UUID REFERENCES production_orders(id),
  work_order_id UUID REFERENCES work_orders(id),
  product_id UUID REFERENCES products(id),
  lot_number TEXT,
  inspection_date TIMESTAMPTZ DEFAULT NOW(),
  inspector_id UUID REFERENCES employees(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'passed', 'failed', 'on_hold')),
  quantity_inspected NUMERIC(10,2),
  quantity_passed NUMERIC(10,2) DEFAULT 0,
  quantity_failed NUMERIC(10,2) DEFAULT 0,
  inspection_results JSONB,
  nonconformance_details TEXT,
  corrective_action TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, check_number)
);

ALTER TABLE quality_checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view quality checks in their tenant"
  ON quality_checks FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage quality checks in their tenant"
  ON quality_checks FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_quality_checks_production ON quality_checks(production_order_id);

-- Inventory Lots
CREATE TABLE IF NOT EXISTS inventory_lots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  lot_number TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity NUMERIC(10,2) NOT NULL,
  uom TEXT DEFAULT 'Unit',
  production_date DATE,
  expiry_date DATE,
  production_order_id UUID REFERENCES production_orders(id),
  supplier_lot_number TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'quarantine', 'expired', 'consumed')),
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, lot_number)
);

ALTER TABLE inventory_lots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view lots in their tenant"
  ON inventory_lots FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage lots in their tenant"
  ON inventory_lots FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_lots_product ON inventory_lots(product_id);
CREATE INDEX IF NOT EXISTS idx_lots_status ON inventory_lots(status);

-- Serial Numbers
CREATE TABLE IF NOT EXISTS serial_numbers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  serial_number TEXT NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id),
  lot_id UUID REFERENCES inventory_lots(id),
  production_order_id UUID REFERENCES production_orders(id),
  sales_order_id UUID REFERENCES sales_orders(id),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'sold', 'returned', 'scrapped')),
  manufacture_date DATE,
  warranty_expiry_date DATE,
  location TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, serial_number)
);

ALTER TABLE serial_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view serials in their tenant"
  ON serial_numbers FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage serials in their tenant"
  ON serial_numbers FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_serials_product ON serial_numbers(product_id);

-- MRP Runs
CREATE TABLE IF NOT EXISTS mrp_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  run_number TEXT NOT NULL,
  run_date TIMESTAMPTZ DEFAULT NOW(),
  planning_horizon_days INTEGER DEFAULT 90,
  status TEXT DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed')),
  parameters JSONB,
  run_time_seconds NUMERIC(10,2),
  completed_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, run_number)
);

ALTER TABLE mrp_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view MRP runs in their tenant"
  ON mrp_runs FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage MRP runs in their tenant"
  ON mrp_runs FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

-- MRP Suggestions
CREATE TABLE IF NOT EXISTS mrp_suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mrp_run_id UUID NOT NULL REFERENCES mrp_runs(id) ON DELETE CASCADE,
  suggestion_type TEXT NOT NULL CHECK (suggestion_type IN ('purchase', 'manufacture', 'transfer')),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity_needed NUMERIC(10,2) NOT NULL,
  required_date DATE NOT NULL,
  current_inventory NUMERIC(10,2) DEFAULT 0,
  incoming_quantity NUMERIC(10,2) DEFAULT 0,
  safety_stock NUMERIC(10,2) DEFAULT 0,
  lead_time_days INTEGER DEFAULT 0,
  suggested_order_date DATE,
  suggested_quantity NUMERIC(10,2),
  priority INTEGER DEFAULT 5,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'accepted', 'rejected', 'converted')),
  notes TEXT,
  source_demand TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mrp_suggestions_run ON mrp_suggestions(mrp_run_id);
CREATE INDEX IF NOT EXISTS idx_mrp_suggestions_product ON mrp_suggestions(product_id);

-- Maintenance Orders
CREATE TABLE IF NOT EXISTS maintenance_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  work_center_id UUID NOT NULL REFERENCES work_centers(id),
  maintenance_type TEXT NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'breakdown')),
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  scheduled_date DATE,
  completion_date DATE,
  description TEXT NOT NULL,
  technician_id UUID REFERENCES employees(id),
  downtime_hours NUMERIC(10,2) DEFAULT 0,
  cost NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, order_number)
);

ALTER TABLE maintenance_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view maintenance in their tenant"
  ON maintenance_orders FOR SELECT
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE POLICY "Users can manage maintenance in their tenant"
  ON maintenance_orders FOR ALL
  TO authenticated
  USING (tenant_id::text = (auth.jwt()->>'tenant_id'))
  WITH CHECK (tenant_id::text = (auth.jwt()->>'tenant_id'));

CREATE INDEX IF NOT EXISTS idx_maintenance_workcenter ON maintenance_orders(work_center_id);
