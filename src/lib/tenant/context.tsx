"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { TenantConfig } from "./types";
import { defaultTenantConfig, mergeTenantConfig } from "./defaults";

interface TenantContextType {
  tenant: TenantConfig;
  isLoading: boolean;
  error: string | null;
  tenantSlug: string | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: defaultTenantConfig,
  isLoading: false,
  error: null,
  tenantSlug: null,
});

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}

interface TenantProviderProps {
  children: React.ReactNode;
  tenantSlug?: string | null;
  initialConfig?: TenantConfig | null;
}

export function TenantProvider({
  children,
  tenantSlug,
  initialConfig,
}: TenantProviderProps) {
  const [tenant, setTenant] = useState<TenantConfig>(
    initialConfig || defaultTenantConfig
  );
  const [isLoading, setIsLoading] = useState(!initialConfig && !!tenantSlug);
  const [error, setError] = useState<string | null>(null);

  // Fetch tenant config if slug is provided and no initial config
  useEffect(() => {
    if (!tenantSlug || initialConfig) {
      return;
    }

    async function fetchTenantConfig() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/tenants/${tenantSlug}`);

        if (!response.ok) {
          if (response.status === 404) {
            // Tenant not found, use default
            setTenant(defaultTenantConfig);
          } else {
            throw new Error("Failed to fetch tenant configuration");
          }
          return;
        }

        const data = await response.json();
        if (data.success && data.data) {
          setTenant(mergeTenantConfig(data.data));
        } else {
          setTenant(defaultTenantConfig);
        }
      } catch (err) {
        console.error("Error fetching tenant config:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
        setTenant(defaultTenantConfig);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTenantConfig();
  }, [tenantSlug, initialConfig]);

  // Apply theme CSS variables
  useEffect(() => {
    if (tenant?.theme) {
      const root = document.documentElement;

      // Convert hex to HSL for CSS variables
      const hexToHSL = (hex: string): string => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0;
        let s = 0;
        const l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r:
              h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
              break;
            case g:
              h = ((b - r) / d + 2) / 6;
              break;
            case b:
              h = ((r - g) / d + 4) / 6;
              break;
          }
        }

        return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
      };

      // Set CSS custom properties
      root.style.setProperty("--primary", hexToHSL(tenant.theme.primaryColor));
      root.style.setProperty("--secondary", hexToHSL(tenant.theme.secondaryColor));
      root.style.setProperty("--accent", hexToHSL(tenant.theme.accentColor));

      // Also set hex values for gradient backgrounds
      root.style.setProperty("--primary-hex", tenant.theme.primaryColor);
      root.style.setProperty("--secondary-hex", tenant.theme.secondaryColor);
      root.style.setProperty("--accent-hex", tenant.theme.accentColor);
    }
  }, [tenant?.theme]);

  // Update page title and favicon
  useEffect(() => {
    if (tenant?.branding) {
      document.title = tenant.branding.name;

      if (tenant.branding.favicon) {
        const favicon = document.querySelector<HTMLLinkElement>(
          'link[rel="icon"]'
        );
        if (favicon) {
          favicon.href = tenant.branding.favicon;
        }
      }
    }
  }, [tenant?.branding]);

  return (
    <TenantContext.Provider
      value={{
        tenant,
        isLoading,
        error,
        tenantSlug: tenantSlug || null,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

// HOC to wrap components with tenant context
export function withTenant<P extends object>(
  Component: React.ComponentType<P & { tenant: TenantConfig }>
) {
  return function WithTenantComponent(props: P) {
    const { tenant } = useTenant();
    return <Component {...props} tenant={tenant} />;
  };
}
