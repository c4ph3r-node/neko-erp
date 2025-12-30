import { supabase } from '../lib/supabase';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface SalesOrder {
  id?: string;
  tenant_id: string;
  order_number: string;
  customer_id: string;
  order_date: string;
  delivery_date?: string;
  status: 'draft' | 'confirmed' | 'processing' | 'fulfilled' | 'invoiced' | 'cancelled' | 'on_hold';
  payment_status: 'unpaid' | 'partial' | 'paid';
  fulfillment_status: 'pending' | 'processing' | 'fulfilled' | 'cancelled';
  currency: string;
  subtotal: number;
  discount_amount?: number;
  tax_amount: number;
  total: number;
  notes?: string;
  internal_notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

interface SalesOrderLine {
  id?: string;
  sales_order_id: string;
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

class SalesOrderService {
  async getOrders(tenantId: string = TENANT_ID): Promise<SalesOrder[]> {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select(`
          *,
          customer:customers(name, email),
          lines:sales_order_lines(*)
        `)
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      // For now, return mock data if database fails
      return this.getMockOrders();
    }
  }

  async getOrderById(id: string): Promise<SalesOrder | null> {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select(`
          *,
          customer:customers(*),
          lines:sales_order_lines(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching sales order:', error);
      return null;
    }
  }

  async createOrder(orderData: Omit<SalesOrder, 'id' | 'created_at' | 'updated_at'>): Promise<SalesOrder> {
    try {
      const orderNumber = await this.getNextOrderNumber();

      const { data, error } = await supabase
        .from('sales_orders')
        .insert({
          ...orderData,
          order_number: orderNumber,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating sales order:', error);
      throw error;
    }
  }

  async updateOrder(id: string, updates: Partial<SalesOrder>): Promise<SalesOrder> {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
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
      console.error('Error updating sales order:', error);
      throw error;
    }
  }

  async deleteOrder(id: string): Promise<void> {
    try {
      // First delete the order lines
      await supabase
        .from('sales_order_lines')
        .delete()
        .eq('sales_order_id', id);

      // Then delete the order
      const { error } = await supabase
        .from('sales_orders')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting sales order:', error);
      throw error;
    }
  }

  async createDeliveryNote(orderId: string, deliveryData: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('delivery_notes')
        .insert({
          ...deliveryData,
          sales_order_id: orderId,
          tenant_id: TENANT_ID,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating delivery note:', error);
      throw error;
    }
  }

  private async getNextOrderNumber(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('sales_orders')
        .select('order_number')
        .eq('tenant_id', TENANT_ID)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const lastOrder = data?.[0];
      const nextNumber = lastOrder ? parseInt(lastOrder.order_number.split('-')[1]) + 1 : 1;
      return `SO-${String(nextNumber).padStart(4, '0')}`;
    } catch (error) {
      console.error('Error getting next order number:', error);
      return `SO-${String(Date.now()).slice(-4)}`;
    }
  }

  private getMockOrders(): SalesOrder[] {
    return [
      {
        id: '1',
        tenant_id: TENANT_ID,
        order_number: 'SO-0001',
        customer_id: '1',
        order_date: '2025-01-10',
        delivery_date: '2025-01-25',
        status: 'confirmed',
        payment_status: 'unpaid',
        fulfillment_status: 'pending',
        currency: 'KES',
        subtotal: 5250.00,
        tax_amount: 525.00,
        total: 5775.00,
        notes: '',
        internal_notes: '',
        customer: { name: 'Acme Corporation', email: 'contact@acme.com' },
        lines: [
          { id: '1', sales_order_id: '1', description: 'Premium Widget A', quantity: 10, unit_price: 450.00, discount_percentage: 0, tax_rate: 16, line_total: 4500.00 },
          { id: '2', sales_order_id: '1', description: 'Standard Widget B', quantity: 5, unit_price: 150.00, discount_percentage: 0, tax_rate: 16, line_total: 750.00 }
        ]
      },
      {
        id: '2',
        tenant_id: TENANT_ID,
        order_number: 'SO-0002',
        customer_id: '2',
        order_date: '2025-01-12',
        delivery_date: '2025-01-28',
        status: 'pending_approval',
        payment_status: 'unpaid',
        fulfillment_status: 'pending',
        currency: 'KES',
        subtotal: 3800.00,
        tax_amount: 380.00,
        total: 4180.00,
        notes: '',
        internal_notes: '',
        customer: { name: 'TechStart Inc', email: 'billing@techstart.com' },
        lines: [
          { id: '3', sales_order_id: '2', description: 'Deluxe Widget C', quantity: 8, unit_price: 475.00, discount_percentage: 0, tax_rate: 16, line_total: 3800.00 }
        ]
      }
    ];
  }
}

export const salesOrderService = new SalesOrderService();