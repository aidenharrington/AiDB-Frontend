import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { Tier } from '../types/Tier';
import { getTierInfo } from '../service/MetadataService';

interface TierContextType {
  tier: Tier | null;
  setTier: (tier: Tier | null) => void;
  updateTierIfNotNull: (newTier: Tier | null) => void;
  fetchTierIfNeeded: (token: string) => Promise<void>;
  refreshTier: (token: string) => Promise<void>;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

interface TierProviderProps {
  children: ReactNode;
}

export const TierProvider: React.FC<TierProviderProps> = ({ children }) => {
  const [tier, setTier] = useState<Tier | null>(null);
  const tierLoadedRef = useRef(false);

  const updateTierIfNotNull = useCallback((newTier: Tier | null) => {
    // Only update if the new tier is not null, preserving existing tier info
    if (newTier !== null) {
      setTier(newTier);
      tierLoadedRef.current = true;
    }
  }, []);

  const fetchTierIfNeeded = useCallback(async (token: string) => {
    // Only fetch if we haven't loaded tier info yet
    if (!tierLoadedRef.current) {
      try {
        const tierInfo = await getTierInfo(token);
        if (tierInfo) {
          setTier(tierInfo);
          tierLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Failed to fetch tier info:', error);
      }
    }
  }, []); // No dependencies to prevent recreation

  const refreshTier = useCallback(async (token: string) => {
    // Force refresh tier info regardless of loaded state
    try {
      const tierInfo = await getTierInfo(token);
      if (tierInfo) {
        setTier(tierInfo);
        tierLoadedRef.current = true;
      }
    } catch (error) {
      console.error('Failed to refresh tier info:', error);
    }
  }, []); // No dependencies to prevent recreation

  return (
    <TierContext.Provider value={{ tier, setTier, updateTierIfNotNull, fetchTierIfNeeded, refreshTier }}>
      {children}
    </TierContext.Provider>
  );
};

export const useTier = (): TierContextType => {
  const context = useContext(TierContext);
  if (context === undefined) {
    throw new Error('useTier must be used within a TierProvider');
  }
  return context;
};
