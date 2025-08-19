import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Tier } from '../types/Tier';
import { getTierInfo } from '../service/MetadataService';

interface TierContextType {
  tier: Tier | null;
  setTier: (tier: Tier | null) => void;
  updateTierIfNotNull: (newTier: Tier | null) => void;
  fetchTierIfNeeded: (token: string) => Promise<void>;
}

const TierContext = createContext<TierContextType | undefined>(undefined);

interface TierProviderProps {
  children: ReactNode;
}

export const TierProvider: React.FC<TierProviderProps> = ({ children }) => {
  const [tier, setTier] = useState<Tier | null>(null);

  const updateTierIfNotNull = (newTier: Tier | null) => {
    // Only update if the new tier is not null, preserving existing tier info
    if (newTier !== null) {
      setTier(newTier);
    }
  };

  const fetchTierIfNeeded = useCallback(async (token: string) => {
    // Only fetch if we don't have tier info
    if (!tier) {
      try {
        const tierInfo = await getTierInfo(token);
        if (tierInfo) {
          setTier(tierInfo);
        }
      } catch (error) {
        console.error('Failed to fetch tier info:', error);
      }
    }
  }, []); // Remove tier dependency to prevent recreation

  return (
    <TierContext.Provider value={{ tier, setTier, updateTierIfNotNull, fetchTierIfNeeded }}>
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
