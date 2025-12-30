import { supabase } from '../lib/supabase';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface PurchaseOrder {
  id?: string;
  tenant_id: string;
  po_number: string;
  vendor_id: string;
  order_date: string;
  delivery_date?: string;
  status: 'draft' | 'submitted' | 'approved' | 'sent' | 'received' | 'invoiced' | 'rejected' | 'cancelled';
  approval_status: 'pending' | 'approved' | 'rejected';
  currency: string;
  subtotal: number;
  discount_amount?: number;
  tax_amount: number;
  total: number;
  notes?: string;
  internal_notes?: string;
  requested_by?: string;
  approved_by?: string;
  department?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

interface PurchaseOrderLine {
  id?: string;
  purchase_order_id: string;
  product_id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  discount_percentage?: number;
  tax_rate: number;
  line_total: number;
  created_at?: string;
  updated_at?: string;
}

class PurchaseOrderService {
  async getOrders(tenantId: string = TENANT_ID): Promise<PurchaseOrder[]> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendor:vendors(name, email),
          lines:purchase_order_lines(*)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
      // For now, return mock data if database fails
      return this.getMockOrders();
    }
  }

  async getOrderById(id: string): Promise<PurchaseOrder | null> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          vendor:vendors(*),
          lines:purchase_order_lines(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching purchase order:', error);
      return null;
    }
  }

  async createOrder(orderData: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at'>): Promise<PurchaseOrder> {
    try {
      const poNumber = await this.getNextOrderNumber();

      const { data, error } = await supabase
        .from('purchase_orders')
        .insert({
          ...orderData,
          po_number: poNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating purchase order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updates: Partial<PurchaseOrder>): Promise<PurchaseOrder> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating purchase order:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      // First delete the order lines
      await supabase
        .from('purchase_order_lines')
        .delete()
        .eq('purchase_order_id', id);

      // Then delete the order
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting purchase order:', error);
      throw error;
    }
  }

  async approveOrder(id: string, approvedBy: string): Promise<PurchaseOrder> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({
          approval_status: 'approved',
          approved_by: approvedBy,
          status: 'approved',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error approving purchase order:', error);
      throw error;
    }
  }

  async rejectOrder(id: string, rejectedBy: string): Promise<PurchaseOrder> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({
          approval_status: 'rejected',
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error rejecting purchase order:', error);
      throw error;
    }
  }

  async sendToVendor(id: string): Promise<PurchaseOrder> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({
          status: 'sent',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error sending purchase order to vendor:', error);
      throw error;
    }
  }

  async createRequisition(requisitionData: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('purchase_requisitions')
        .insert({
          ...requisitionData,
          tenant_id: TENANT_ID,
          status: 'draft',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating purchase requisition:', error);
      throw error;
    }
  }

  private async getNextOrderNumber(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('po_number')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const lastOrder = data?.[0];
      const nextNumber = lastOrder ? parseInt(lastOrder.po_number.split('-')[1]) + 1 : 1;
      return `PO-${String(nextNumber).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error getting next PO number:', error);
      return `PO-${String(Date.now()).slice(-4)}`;
    }
  }

  private getMockOrders(): PurchaseOrder[] {
    return [
      {
        id: '1',
        tenant_id: TENANT_ID,
        po_number: 'PO-0001',
        vendor_id: '1',
        order_date: '2025-01-10',
        delivery_date: '2025-01-25',
        status: 'approved',
        approval_status: 'approved',
        currency: 'KES',
        subtotal: 2500.00,
        tax_amount: 250.00,
        total: 2750.00,
        notes: '',
        internal_notes: '',
        requested_by: 'Jane Doe',
        approved_by: 'John Smith',
        department: 'Administration',
        vendor: { name: 'Office Supplies Co.', email: 'sales@officesupplies.com' },
        lines: [
          { id: '1', purchase_order_id: '1', description: 'Office Chairs', quantity: 10, unit_price: 150.00, discount_percentage: 0, tax_rate: 16, line_total: 1500.00 },
          { id: '2', purchase_order_id: '1', description: 'Desk Supplies', quantity: 20, unit_price: 50.00, discount_percentage: 0, tax_rate: 16, line_total: 1000.00 }
        ]
      },
      {
        id: '2',
        tenant_id: TENANT_ID,
        po_number: 'PO-0002',
        vendor_id: '2',
        order_date: '2025-01-12',
        delivery_date: '2025-01-28',
        status: 'pending_approval',
        approval_status: 'pending',
        currency: 'KES',
        subtotal: 5200.00,
        tax_amount: 520.00,
        total: 5720.00,
        notes: '',
        internal_notes: '',
        requested_by: 'Bob Johnson',
        department: 'IT',
        vendor: { name: 'Tech Equipment Ltd', email: 'sales@techequipment.com' },
        lines: [
          { id: '3', purchase_order_id: '2', description: 'Laptops', quantity: 4, unit_price: 1200.00, discount_percentage: 0, tax_rate: 16, line_total: 4800.00 },
          { id: '4', purchase_order_id: '2', description: 'Monitors', quantity: 4, unit_price: 100.00, discount_percentage: 0, tax_rate: 16, line_total: 400.00 }
        ]
      }
    ];
  }
}

export const purchaseOrderService = new PurchaseOrderService();