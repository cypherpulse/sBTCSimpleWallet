import { connect, disconnect as stacksDisconnect, isConnected, getLocalStorage } from '@stacks/connect';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import BitcoinIcon from './BitcoinIcon';
import { WALLETCONNECT_PROJECT_ID } from '@/lib/stacks';

interface ConnectWalletProps {
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

const ConnectWallet = ({ onConnect, onDisconnect }: ConnectWalletProps) => {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      const isUserConnected = isConnected();
      if (isUserConnected) {
        const storage = getLocalStorage();
        if (storage?.addresses?.stx?.[0]?.address) {
          const userAddress = storage.addresses.stx[0].address;
          setAddress(userAddress);
          setConnected(true);
          onConnect(userAddress);
        }
      }
    };
    checkConnection();
  }, [onConnect]);

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const response = await connect({
        walletConnectProjectId: WALLETCONNECT_PROJECT_ID,
      });
      
      if (response && response.addresses) {
        const stxAddress = response.addresses.find(
          (addr) => addr.symbol === 'STX'
        );
        if (stxAddress) {
          setAddress(stxAddress.address);
          setConnected(true);
          onConnect(stxAddress.address);
        }
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      // Use the official disconnect function from @stacks/connect
      await stacksDisconnect();
    } catch (error) {
      console.error('Error during disconnect:', error);
    }
    // Clear local storage items related to stacks session
    localStorage.removeItem('stacks-session');
    localStorage.removeItem('blockstack-session');
    // Clear any WalletConnect session data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('wc@') || key.startsWith('walletconnect')) {
        localStorage.removeItem(key);
      }
    });
    setConnected(false);
    setAddress(null);
    onDisconnect();
  };

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected && address) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary/50 border border-border">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm font-medium text-foreground">
            {truncateAddress(address)}
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          className="border-muted-foreground/30 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      size="lg"
      className="relative overflow-hidden bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-xl glow-orange animate-pulse-glow transition-all duration-300 hover:scale-105"
    >
      <div className="flex items-center gap-3">
        <BitcoinIcon size={28} className="text-primary-foreground" />
        <span>{isLoading ? 'Connecting...' : 'Connect Wallet – Mobile QR Ready'}</span>
      </div>
    </Button>
  );
};

export default ConnectWallet;
