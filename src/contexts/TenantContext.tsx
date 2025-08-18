import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface Tenant {
  id: string;
  name: string;
  logo?: string;
  subdomain: string;
  settings: {
    currency: string;
    dateFormat: string;
    language: string;
    timezone: string;
    fiscalYearStart: string;
  };
}

interface TenantContextType {
  tenant: Tenant | null;
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

  useEffect(() => {
    if (user) {
      // Mock tenant data - in real app, this would be fetched from API
      const mockTenant: Tenant = {
        id: user.tenantId,
        name: 'Acme Corporation',
        subdomain: 'acme',
        settings: {
          currency: 'USD',
          dateFormat: 'MM/dd/yyyy',
          language: 'en',
          timezone: 'America/New_York',
          fiscalYearStart: '01/01'
        }
      };
      
      setTenant(mockTenant);
    } else {
      setTenant(null);
    }
    setLoading(false);
  }, [user]);

  return (
    <TenantContext.Provider value={{ tenant, loading }}>
      {children}
    </TenantContext.Provider>
  );
}