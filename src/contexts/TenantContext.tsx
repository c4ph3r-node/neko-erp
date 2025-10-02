import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  logo?: string;
  plan: 'starter' | 'professional' | 'enterprise';
  status: 'trial' | 'active' | 'suspended' | 'cancelled';
  trialStartDate?: Date;
  trialEndDate?: Date;
  subscriptionStartDate?: Date;
  subscriptionEndDate?: Date;
  settings: TenantSettings;
  billing: BillingInfo;
  usage: UsageMetrics;
  isActive: boolean;
  createdAt: Date;
}

export interface TenantSettings {
  currency: string;
  dateFormat: string;
  language: string;
  timezone: string;
  fiscalYearStart: string;
  industry: string;
  businessType: string;
  kraPin?: string;
  vatNumber?: string;
  address: {
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  features: string[];
  integrations: {
    kra: boolean;
    mpesa: boolean;
    banks: string[];
  };
}

export interface BillingInfo {
  plan: string;
  monthlyAmount: number;
  billingCycle: 'monthly' | 'yearly';
  nextBillingDate?: Date;
  paymentMethod?: {
    type: 'card' | 'mpesa' | 'bank_transfer';
    last4?: string;
    mpesaNumber?: string;
  };
  invoices: BillingInvoice[];
}

export interface BillingInvoice {
  id: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'overdue';
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
}

export interface UsageMetrics {
  activeUsers: number;
  maxUsers: number;
  storageUsed: number; // in MB
  storageLimit: number; // in MB
  apiCalls: number;
  documentsGenerated: number;
  lastActivity: Date;
}

interface TenantContextType {
  tenant: Tenant | null;
  updateTenant: (updates: Partial<Tenant>) => void;
  updateSettings: (settings: Partial<TenantSettings>) => void;
  updateBilling: (billing: Partial<BillingInfo>) => void;
  checkTrialStatus: () => { isExpired: boolean; daysRemaining: number };
  upgradePlan: (plan: string) => void;
  cancelSubscription: () => void;
  loading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const updateTenant = (updates: Partial<Tenant>) => {
    setTenant(prev => prev ? { ...prev, ...updates } : null);
    // In real app, this would make an API call
    console.log('Updating tenant:', updates);
  };

  const updateSettings = (settings: Partial<TenantSettings>) => {
    setTenant(prev => prev ? { 
      ...prev, 
      settings: { ...prev.settings, ...settings }
    } : null);
    console.log('Updating tenant settings:', settings);
  };

  const updateBilling = (billing: Partial<BillingInfo>) => {
    setTenant(prev => prev ? { 
      ...prev, 
      billing: { ...prev.billing, ...billing }
    } : null);
    console.log('Updating billing info:', billing);
  };

  const checkTrialStatus = () => {
    if (!tenant?.trialEndDate) {
      return { isExpired: false, daysRemaining: 0 };
    }
    
    const now = new Date();
    const trialEnd = new Date(tenant.trialEndDate);
    const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      isExpired: daysRemaining <= 0,
      daysRemaining: Math.max(0, daysRemaining)
    };
  };

  const upgradePlan = (plan: string) => {
    const planPricing = {
      starter: 2999,
      professional: 7999,
      enterprise: 19999
    };

    updateTenant({
      plan: plan as any,
      status: 'active',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    updateBilling({
      plan,
      monthlyAmount: planPricing[plan as keyof typeof planPricing],
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  };

  const cancelSubscription = () => {
    updateTenant({ status: 'cancelled' });
  };

  useEffect(() => {
    if (user) {
      // Mock tenant data - in real app, this would be fetched from API
      const mockTenant: Tenant = {
        id: user.tenantId,
        name: 'Acme Corporation Kenya Ltd',
        subdomain: 'acme-kenya',
        plan: 'professional',
        status: 'trial',
        trialStartDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        trialEndDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000), // 25 days remaining
        settings: {
          currency: 'KES',
          dateFormat: 'dd/MM/yyyy',
          language: 'en',
          timezone: 'Africa/Nairobi',
          fiscalYearStart: '01/01',
          industry: 'Technology & Software',
          businessType: 'Private Limited Company',
          kraPin: 'P051234567A',
          vatNumber: 'VAT001234567',
          address: {
            street: 'Westlands Business Park, Ring Road',
            city: 'Nairobi',
            county: 'Nairobi',
            postalCode: '00100',
            country: 'Kenya'
          },
          contact: {
            phone: '+254 722 123 456',
            email: 'info@acme.co.ke',
            website: 'https://acme.co.ke'
          },
          features: ['accounting', 'invoicing', 'inventory', 'payroll', 'projects'],
          integrations: {
            kra: true,
            mpesa: true,
            banks: ['KCB', 'Equity Bank']
          }
        },
        billing: {
          plan: 'professional',
          monthlyAmount: 7999,
          billingCycle: 'monthly',
          nextBillingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
          invoices: [
            {
              id: 'INV-2025-001',
              amount: 7999,
              currency: 'KES',
              status: 'paid',
              issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              dueDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
              paidDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        usage: {
          activeUsers: 8,
          maxUsers: 15,
          storageUsed: 2500, // 2.5 GB
          storageLimit: 51200, // 50 GB
          apiCalls: 15420,
          documentsGenerated: 342,
          lastActivity: new Date()
        },
        isActive: true,
        createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000)
      };
      
      setTenant(mockTenant);
    } else {
      setTenant(null);
    }
    setLoading(false);
  }, [user]);

  return (
    <TenantContext.Provider value={{ 
      tenant, 
      updateTenant, 
      updateSettings, 
      updateBilling, 
      checkTrialStatus, 
      upgradePlan, 
      cancelSubscription, 
      loading 
    }}>
      {children}
    </TenantContext.Provider>
  );
}