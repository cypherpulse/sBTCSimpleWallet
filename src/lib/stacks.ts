import { Cl, ClarityValue, cvToValue, hexToCV } from '@stacks/transactions';

// Contract Configuration
export const CONTRACT_ADDRESS = 'STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y';
export const CONTRACT_NAME = 'sbtc-simple-wallet';
export const FULL_CONTRACT = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}`;
export const SBTC_TOKEN = 'STGDS0Y17973EN5TCHNHGJJ9B31XWQ5YXBQ0KQ2Y.sbtc-token';

// Stacks API endpoint for testnet
export const STACKS_API_URL = 'https://api.testnet.hiro.so';

export const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';
// Backward compatibility
export const WALLET_CONNECT_PROJECT_ID = WALLETCONNECT_PROJECT_ID;

export interface WalletBalance {
  address: string;
  balance: bigint;
  formattedBalance: string;
}

// Convert sBTC display amount to micro-units (satoshis)
export function toMicroUnits(amount: number): bigint {
  return BigInt(Math.floor(amount * 100_000_000));
}

// Convert micro-units to sBTC display amount
export function fromMicroUnits(microUnits: bigint | number): number {
  const value = typeof microUnits === 'bigint' ? microUnits : BigInt(microUnits);
  return Number(value) / 100_000_000;
}

// Format sBTC for display
export function formatSBTC(amount: number): string {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 8,
    maximumFractionDigits: 8,
  });
}

export function shortenAddress(address: string): string {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Create deposit function args
export function createDepositArgs(amount: number): ClarityValue[] {
  return [Cl.uint(toMicroUnits(amount))];
}

// Create withdraw function args
export function createWithdrawArgs(amount: number): ClarityValue[] {
  return [Cl.uint(toMicroUnits(amount))];
}

// Create get-balance function args
export function createGetBalanceArgs(address: string): ClarityValue[] {
  return [Cl.principal(address)];
}

// Parse balance response from get-balance read-only call
export function parseBalanceResponse(result: string): bigint {
  try {
    const cv = hexToCV(result);
    const value = cvToValue(cv);
    return BigInt(value);
  } catch {
    return BigInt(0);
  }
}

// Fetch balance from contract using direct API call
export const fetchBalance = async (address: string): Promise<bigint> => {
  if (!address) return BigInt(0);
  
  try {
    const url = `${STACKS_API_URL}/v2/contracts/call-read/${CONTRACT_ADDRESS}/${CONTRACT_NAME}/get-balance`;
    
    // Serialize the principal argument to hex string
    const principalCV = Cl.principal(address);
    const serialized = Cl.serialize(principalCV);
    // Convert Uint8Array to hex string
    const hexArg = '0x' + Array.from(serialized).map(b => b.toString(16).padStart(2, '0')).join('');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: address,
        arguments: [hexArg],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', errorText);
      return BigInt(0);
    }

    const data = await response.json();
    
    if (data.okay && data.result) {
      return parseBalanceResponse(data.result);
    }
    
    return BigInt(0);
  } catch (error) {
    console.error('Error fetching balance:', error);
    return BigInt(0);
  }
};
