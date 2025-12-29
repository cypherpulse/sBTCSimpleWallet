import { useEffect, useState, useCallback } from 'react';
import { fetchBalance, fromMicroUnits, formatSBTC } from '@/lib/stacks';
import BitcoinIcon from './BitcoinIcon';
import { RefreshCw } from 'lucide-react';

interface BalanceDisplayProps {
  address: string;
  refreshTrigger?: number;
}

const BalanceDisplay = ({ address, refreshTrigger = 0 }: BalanceDisplayProps) => {
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadBalance = useCallback(async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const rawBalance = await fetchBalance(address);
      setBalance(fromMicroUnits(rawBalance));
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load balance:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  useEffect(() => {
    loadBalance();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadBalance, 10000);
    
    return () => clearInterval(interval);
  }, [loadBalance, refreshTrigger]);

  return (
    <div className="relative p-8 rounded-2xl gradient-border card-glow overflow-hidden">
      {/* Background decoration */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-muted-foreground">Your sBTC Balance</h2>
          <button
            onClick={loadBalance}
            disabled={isLoading}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors disabled:opacity-50"
          >
            <RefreshCw 
              size={18} 
              className={`text-muted-foreground ${isLoading ? 'animate-spin' : ''}`} 
            />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <BitcoinIcon 
            size={64} 
            className="text-primary bitcoin-icon-glow animate-float" 
          />
          <div className="flex flex-col">
            <span className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
              {isLoading ? (
                <span className="inline-block w-48 h-12 bg-secondary/50 rounded-lg animate-pulse" />
              ) : (
                formatSBTC(balance)
              )}
            </span>
            <span className="text-xl font-semibold text-primary mt-1">sBTC</span>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BalanceDisplay;
