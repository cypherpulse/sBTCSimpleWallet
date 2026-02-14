import { useState, useCallback } from 'react';
import ConnectWallet from '@/components/ConnectWallet';
import BalanceDisplay from '@/components/BalanceDisplay';
import DepositForm from '@/components/DepositForm';
import WithdrawForm from '@/components/WithdrawForm';
import BitcoinIcon from '@/components/BitcoinIcon';

const Index = () => {
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleConnect = useCallback((address: string) => {
    setConnectedAddress(address);
  }, []);

  const handleDisconnect = useCallback(() => {
    setConnectedAddress(null);
  }, []);

  const handleTransactionSuccess = useCallback(() => {
    // Trigger balance refresh after transaction
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Background decorations */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />
      </div>

      {/* Floating Bitcoin icons */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <BitcoinIcon 
          size={120} 
          className="absolute -top-10 -right-10 text-primary/10 animate-spin-slow" 
        />
        <BitcoinIcon 
          size={80} 
          className="absolute bottom-20 -left-10 text-primary/10 animate-spin-slow" 
          style={{ animationDirection: 'reverse' }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        {/* Header */}
        <header className="text-center mb-8 md:mb-12 animate-fade-in">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            <BitcoinIcon size={48} className="text-primary bitcoin-icon-glow animate-float sm:w-14 sm:h-14" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
             sBTC Wallet
            </h1>
          </div>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium">
            Deposit & Withdraw <span className="text-primary">₿</span>
          </p>
          <p className="text-sm sm:text-base text-muted-foreground/70 mt-2 px-4">
            Your personal sBTC vault on Bitcoin L2 (Stacks Testnet)
          </p>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto">
          {!connectedAddress ? (
            /* Not Connected State */
            <div
              className="flex flex-col items-center justify-center py-12 md:py-20 animate-fade-in px-4"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="mb-6 md:mb-8 p-6 md:p-8 rounded-3xl bg-card/50 border border-border/50 card-glow">
                <BitcoinIcon
                  size={80}
                  className="text-primary bitcoin-icon-glow animate-pulse-glow md:w-30 md:h-30"
                />
              </div>

              <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-3 md:mb-4 text-center">
                Connect Your Wallet
              </h2>
              <p className="text-muted-foreground mb-6 md:mb-8 text-center max-w-sm md:max-w-md text-sm md:text-base px-4">
                Connect your Stacks wallet to deposit and withdraw sBTC from your personal vault.
                Supports mobile wallets via WalletConnect QR code.
              </p>

              <ConnectWallet
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />

              <div className="mt-8 md:mt-12 grid grid-cols-3 gap-4 md:gap-8 text-center w-full max-w-md">
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-primary">₿</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Deposit sBTC</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-primary">🔒</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Secure Vault</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl md:text-3xl font-bold text-primary">⚡</div>
                  <p className="text-xs md:text-sm text-muted-foreground">Fast Transactions</p>
                </div>
              </div>
            </div>
          ) : (
            /* Connected State - Dashboard */
            <div className="space-y-6 md:space-y-8">
              {/* Wallet Info Bar */}
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-card/50 border border-border/50 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <BitcoinIcon size={28} className="text-primary md:w-8 md:h-8" />
                  <span className="text-base md:text-lg font-medium text-foreground">Wallet Dashboard</span>
                </div>
                <ConnectWallet
                  onConnect={handleConnect}
                  onDisconnect={handleDisconnect}
                />
              </div>

              {/* Balance Card */}
              <div
                className="animate-slide-up"
                style={{ animationDelay: '0.1s' }}
              >
                <BalanceDisplay
                  address={connectedAddress}
                  refreshTrigger={refreshTrigger}
                />
              </div>

              {/* Action Cards */}
              <div
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 animate-slide-up"
                style={{ animationDelay: '0.2s' }}
              >
                <DepositForm
                  address={connectedAddress}
                  onSuccess={handleTransactionSuccess}
                />
                <WithdrawForm
                  address={connectedAddress}
                  onSuccess={handleTransactionSuccess}
                />
              </div>

              {/* Contract Info */}
              <div
                className="p-4 sm:p-6 rounded-xl bg-card/30 border border-border/30 animate-slide-up"
                style={{ animationDelay: '0.3s' }}
              >
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Contract Information</h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground font-medium">Contract:</span>
                    <code className="px-3 py-2 rounded-lg bg-secondary/50 text-foreground text-xs break-all">
                      STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y.sbtc-simple-wallet
                    </code>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-muted-foreground font-medium min-w-[80px] sm:min-w-[120px]">Network:</span>
                    <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                      Stacks Testnet
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 md:mt-16 border-t border-border/50 pt-6 md:pt-8 animate-fade-in px-4" style={{ animationDelay: '0.4s' }}>
          <div className="text-center space-y-4">
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 text-xs sm:text-sm text-muted-foreground">
              <a
                href="https://docs.stacks.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Stacks Docs
              </a>
              <span className="text-muted-foreground/40 hidden sm:inline">•</span>
              <a
                href="https://explorer.stacks.co"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Explorer
              </a>
              <span className="text-muted-foreground/40 hidden sm:inline">•</span>
              <a
                href="https://github.com/your-username/sbtc-simple-wallet"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub
              </a>
              <span className="text-muted-foreground/40 hidden sm:inline">•</span>
              <a
                href="https://discord.gg/stacks"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                Discord
              </a>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground/60">
              <p>Built with ❤️ on the Stacks blockchain</p>
              <p className="mt-1">Decentralized wallet for sBTC • Secure • Non-custodial • Open source</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
