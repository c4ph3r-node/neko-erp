import { supabase } from '../lib/supabase';

const TENANT_ID = '00000000-0000-0000-0000-000000000001';

interface Customer {
  id?: string;
  tenant_id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  tax_id?: string;
  payment_terms?: string;
  credit_limit?: number;
  balance?: number;
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
  created_by?: string;
  updated_by?: string;
  created_at?: string;
  updated_at?: string;
}

class CustomerService {
  async getCustomers(tenantId: string = TENANT_ID): Promise<Customer[]> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching customers:', error);
      // For now, return mock data if database fails
      return this.getMockCustomers();
    }
  }

  async getCustomerById(id: string): Promise<Customer | null> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching customer:', error);
      return null;
    }
  }

  async createCustomer(customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert({
          ...customerData,
          balance: customerData.balance || 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await supabase
        .from('customers')
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
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  async createInvoice(customerId: string, invoiceData: any): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .insert({
          ...invoiceData,
          customer_id: customerId,
          tenant_id: TENANT_ID,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating invoice:', error);
      throw error;
    }
  }

  async getCustomerBalance(customerId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('balance')
        .eq('id', customerId)
        .single();

      if (error) throw error;
      return data?.balance || 0;
    } catch (error) {
      console.error('Error fetching customer balance:', error);
      return 0;
    }
  }

  async updateCustomerBalance(customerId: string, newBalance: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('customers')
        .update({
          balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', customerId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating customer balance:', error);
      throw error;
    }
  }

  private getMockCustomers(): Customer[] {
    return [
      {
        id: '1',
        tenant_id: TENANT_ID,
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Ave, New York, NY 10001',
        balance: 5250.00,
        status: 'active',
        payment_terms: 'Net 30',
        credit_limit: 10000.00,
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-15T00:00:00Z'
      },
      {
        id: '2',
        tenant_id: TENANT_ID,
        name: 'TechStart Inc',
        email: 'billing@techstart.com',
        phone: '+1 (555) 987-6543',
        address: '456 Innovation Dr, San Francisco, CA 94105',
        balance: 3800.00,
        status: 'active',
        payment_terms: 'Net 15',
        credit_limit: 5000.00,
        created_at: '2025-01-02T00:00:00Z',
        updated_at: '2025-01-14T00:00:00Z'
      },
      {
        id: '3',
        tenant_id: TENANT_ID,
        name: 'Global Dynamics',
        email: 'accounting@globaldynamics.com',
        phone: '+1 (555) 456-7890',
        address: '789 Corporate Blvd, Chicago, IL 60601',
        balance: 0.00,
        status: 'active',
        payment_terms: 'Net 30',
        credit_limit: 15000.00,
        created_at: '2025-01-03T00:00:00Z',
        updated_at: '2025-01-10T00:00:00Z'
      },
      {
        id: '4',
        tenant_id: TENANT_ID,
        name: 'Creative Solutions LLC',
        email: 'info@creativesolutions.com',
        phone: '+1 (555) 321-9876',
        address: '321 Design St, Los Angeles, CA 90210',
        balance: 1200.00,
        status: 'inactive',
        payment_terms: 'Net 45',
        credit_limit: 3000.00,
        created_at: '2024-12-15T00:00:00Z',
        updated_at: '2024-12-28T00:00:00Z'
      }
    ];
  }
}

export const customerService = new CustomerService();