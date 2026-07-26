import { useContext } from 'react';
import { MarketplaceContext, MarketplaceContextValue } from '../providers/MarketplaceContext';

export function useMarketplace(): MarketplaceContextValue {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}
