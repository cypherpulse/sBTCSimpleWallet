import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import { Cl } from '@stacks/transactions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CONTRACT_ADDRESS, CONTRACT_NAME, toMicroUnits, WALLETCONNECT_PROJECT_ID } from '@/lib/stacks';
import BitcoinIcon from './BitcoinIcon';
import { ArrowUpFromLine } from 'lucide-react';

interface WithdrawFormProps {
  address: string;
  onSuccess: () => void;
}

const WithdrawForm = ({ address, onSuccess }: WithdrawFormProps) => {
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid sBTC amount to withdraw.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const microAmount = toMicroUnits(parseFloat(amount));
    
    await openContractCall({
      network: new StacksTestnet(),
      contractAddress: CONTRACT_ADDRESS,
      contractName: CONTRACT_NAME,
      functionName: 'withdraw',
      functionArgs: [Cl.uint(microAmount)],
      onFinish: (data) => {
        toast({
          title: 'Withdrawal Submitted! ₿',
          description: `Transaction ID: ${data.txId.slice(0, 16)}...`,
        });
        setAmount('');
        onSuccess();
        setIsLoading(false);
      },
      onCancel: () => {
        toast({
          title: 'Withdrawal Cancelled',
          description: 'Transaction was cancelled by user.',
          variant: 'destructive',
        });
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl gradient-border card-glow">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 sm:p-3 rounded-xl bg-destructive/10">
          <ArrowUpFromLine className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">Withdraw sBTC</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">Remove funds from your vault</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type="number"
            placeholder="0.00000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-12 sm:h-14 text-base sm:text-lg pl-10 sm:pl-12 bg-secondary/30 border-border/50 focus:border-destructive focus:ring-destructive/20"
            step="0.00000001"
            min="0"
          />
          <BitcoinIcon
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-primary sm:w-6 sm:h-6"
          />
          <span className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm sm:text-base">
            sBTC
          </span>
        </div>

        <Button
          onClick={handleWithdraw}
          disabled={isLoading || !amount}
          variant="outline"
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive rounded-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowUpFromLine size={20} className="sm:w-6 sm:h-6" />
            <span>{isLoading ? 'Processing...' : 'Withdraw sBTC ₿'}</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default WithdrawForm;
