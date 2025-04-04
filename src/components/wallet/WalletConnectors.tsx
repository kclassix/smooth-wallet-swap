
import React, { useState } from 'react';
import { useWallet } from '@/contexts/WalletContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Wallet as WalletIcon, RefreshCw, LogOut } from 'lucide-react';
import { WalletCard } from './WalletCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface WalletConnectorsProps {
  closeModal: () => void;
}

export const WalletConnectors: React.FC<WalletConnectorsProps> = ({ closeModal }) => {
  const { wallets, connectWallet, disconnectAll, isConnecting } = useWallet();
  const [activeTab, setActiveTab] = useState(wallets.length > 0 ? "manage" : "connect");

  const connectors = [
    {
      id: 'metaMask',
      name: 'MetaMask',
      icon: '🦊',
      description: 'Connect to your MetaMask wallet',
    },
    {
      id: 'walletConnect',
      name: 'WalletConnect',
      icon: '🔗',
      description: 'Scan with WalletConnect to connect',
    },
    {
      id: 'coinbaseWallet',
      name: 'Coinbase Wallet',
      icon: '💰',
      description: 'Connect to your Coinbase wallet',
    },
    {
      id: 'injected',
      name: 'Browser Wallet',
      icon: '🔌',
      description: 'Connect using your browser extension',
    },
  ];

  const handleConnect = async (connectorId: string) => {
    await connectWallet(connectorId);
    if (wallets.length === 0) {
      setActiveTab("manage");
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="manage">Manage Wallets</TabsTrigger>
        <TabsTrigger value="connect">Connect New</TabsTrigger>
      </TabsList>
      
      <TabsContent value="manage" className="space-y-4 py-4">
        {wallets.length === 0 ? (
          <div className="text-center p-6">
            <WalletIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No wallets connected</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect a wallet to get started
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setActiveTab("connect")}
            >
              <Plus className="mr-2 h-4 w-4" />
              Connect a wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {wallets.map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} onClose={closeModal} />
              ))}
            </div>
            
            <div className="pt-4 flex gap-2 justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveTab("connect")}
                className="flex-1"
              >
                <Plus className="mr-2 h-4 w-4" />
                Connect Another
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={disconnectAll}
                className="flex-1"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect All
              </Button>
            </div>
          </>
        )}
      </TabsContent>
      
      <TabsContent value="connect" className="space-y-4 py-4">
        <div className="grid gap-4">
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => handleConnect(connector.id)}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
              ) : (
                <span className="mr-3 text-xl">{connector.icon}</span>
              )}
              <div className="flex flex-col items-start">
                <span className="font-medium">{connector.name}</span>
                <span className="text-xs text-muted-foreground">{connector.description}</span>
              </div>
            </Button>
          ))}
        </div>

        {wallets.length > 0 && (
          <div className="pt-4">
            <Separator className="my-4" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("manage")}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Back to Manage Wallets
            </Button>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};
