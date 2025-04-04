
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createConfig, 
  http, 
  type WalletClient, 
  useAccount, 
  useConnect, 
  useDisconnect, 
  WagmiProvider 
} from '@reown/appkit';
import { mainnet, sepolia } from '@reown/appkit/chains';
import { injected, metaMask, walletConnect, coinbaseWallet } from '@reown/appkit/connectors';
import { useToast } from '@/components/ui/use-toast';

// Define the available wallet connectors
const connectors = [
  injected({ target: 'metaMask' }),
  metaMask(),
  walletConnect({
    projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || 'default-project-id',
    metadata: {
      name: 'Multi Wallet Dapp',
      description: 'A dapp that supports multiple wallet connections',
      url: window.location.origin,
      icons: [`${window.location.origin}/favicon.ico`],
    },
  }),
  coinbaseWallet({
    appName: 'Multi Wallet Dapp',
    appLogoUrl: `${window.location.origin}/favicon.ico`,
  }),
];

// Wallet type definition
export interface WalletInfo {
  id: string;
  address: string;
  connector: string;
  isActive: boolean;
  ensName?: string;
  chainId: number;
}

// Context type definition
interface WalletContextType {
  wallets: WalletInfo[];
  activeWallet: WalletInfo | null;
  connectWallet: (connectorId: string) => Promise<void>;
  switchWallet: (walletId: string) => void;
  disconnectWallet: (walletId: string) => void;
  disconnectAll: () => void;
  isConnecting: boolean;
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Config for wagmi
const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors,
});

// Provider component
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallets, setWallets] = useState<WalletInfo[]>([]);
  const [activeWallet, setActiveWallet] = useState<WalletInfo | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();
  
  // Function to create a unique wallet ID
  const createWalletId = (address: string, connectorName: string) => {
    return `${address.toLowerCase()}-${connectorName}`;
  };

  // Handle wallet connection
  const connectWallet = async (connectorId: string) => {
    try {
      setIsConnecting(true);
      
      // Find the connector by ID
      const connector = connectors.find(c => c.id === connectorId);
      if (!connector) {
        throw new Error(`Connector ${connectorId} not found`);
      }
      
      // Connect using the selected connector
      const connection = await connector.connect();
      
      // Create a wallet info object
      const newWalletInfo: WalletInfo = {
        id: createWalletId(connection.account, connector.name),
        address: connection.account,
        connector: connector.name,
        isActive: true,
        chainId: connection.chainId,
      };
      
      // Update wallets list
      setWallets(prev => {
        // Check if wallet already exists
        const existingWalletIndex = prev.findIndex(w => w.id === newWalletInfo.id);
        if (existingWalletIndex >= 0) {
          // Update existing wallet
          const updatedWallets = [...prev];
          updatedWallets[existingWalletIndex] = {
            ...updatedWallets[existingWalletIndex],
            isActive: true
          };
          return updatedWallets;
        } else {
          // Add new wallet
          return [...prev, newWalletInfo];
        }
      });
      
      // Set as active wallet
      setActiveWallet(newWalletInfo);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${shortenAddress(connection.account)}`,
      });
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: (error as Error).message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  // Switch active wallet
  const switchWallet = (walletId: string) => {
    const walletToActivate = wallets.find(w => w.id === walletId);
    if (!walletToActivate) return;
    
    // Deactivate all wallets
    const updatedWallets = wallets.map(wallet => ({
      ...wallet,
      isActive: wallet.id === walletId
    }));
    
    setWallets(updatedWallets);
    setActiveWallet(walletToActivate);
    
    toast({
      title: "Wallet Switched",
      description: `Now using ${shortenAddress(walletToActivate.address)}`,
    });
  };

  // Disconnect a specific wallet
  const disconnectWallet = (walletId: string) => {
    const walletToDisconnect = wallets.find(w => w.id === walletId);
    if (!walletToDisconnect) return;
    
    // Find the connector
    const connector = connectors.find(c => c.name === walletToDisconnect.connector);
    if (connector) {
      connector.disconnect();
    }
    
    // Remove wallet from list
    const updatedWallets = wallets.filter(wallet => wallet.id !== walletId);
    setWallets(updatedWallets);
    
    // If active wallet was disconnected, set a new active wallet
    if (activeWallet?.id === walletId) {
      const newActiveWallet = updatedWallets.length > 0 ? updatedWallets[0] : null;
      setActiveWallet(newActiveWallet);
    }
    
    toast({
      title: "Wallet Disconnected",
      description: `Disconnected ${shortenAddress(walletToDisconnect.address)}`,
    });
  };

  // Disconnect all wallets
  const disconnectAll = () => {
    // Disconnect each wallet
    connectors.forEach(connector => {
      connector.disconnect();
    });
    
    setWallets([]);
    setActiveWallet(null);
    
    toast({
      title: "All Wallets Disconnected",
      description: "Successfully disconnected all wallets",
    });
  };

  // Helper function to shorten address
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <WagmiProvider config={config}>
      <WalletContext.Provider
        value={{
          wallets,
          activeWallet,
          connectWallet,
          switchWallet,
          disconnectWallet,
          disconnectAll,
          isConnecting
        }}
      >
        {children}
      </WalletContext.Provider>
    </WagmiProvider>
  );
};

// Hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
