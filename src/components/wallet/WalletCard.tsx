
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useWallet, type WalletInfo } from '@/contexts/WalletContext';
import { Check, ExternalLink, LogOut } from 'lucide-react';
import { useState } from 'react';

interface WalletCardProps {
  wallet: WalletInfo;
  onClose?: () => void;
}

export const WalletCard: React.FC<WalletCardProps> = ({ wallet, onClose }) => {
  const { switchWallet, disconnectWallet, activeWallet } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSwitchWallet = () => {
    switchWallet(wallet.id);
    if (onClose) onClose();
  };
  
  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnectWallet(wallet.id);
  };
  
  // Check if this wallet is the active one
  const isActive = activeWallet?.id === wallet.id;
  
  // Format chain name
  const getChainName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'Ethereum';
      case 11155111:
        return 'Sepolia';
      default:
        return `Chain ID: ${chainId}`;
    }
  };
  
  // Shorten address for display
  const shortenAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Card
      className={`relative overflow-hidden transition-all ${
        isActive ? 'ring-2 ring-primary' : 'hover:bg-muted/30'
      }`}
      onClick={handleSwitchWallet}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4 cursor-pointer">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              {/* Wallet icon or connector logo would go here */}
              <span className="text-lg">{wallet.connector === 'MetaMask' ? '🦊' : '👛'}</span>
            </div>
            <div className="flex flex-col">
              <div className="font-semibold">{wallet.connector}</div>
              <div className="text-sm text-muted-foreground font-mono">
                {shortenAddress(wallet.address)}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {getChainName(wallet.chainId)}
            </Badge>
            
            {isActive && (
              <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                <Check className="h-3 w-3 mr-1" /> Active
              </Badge>
            )}
          </div>
        </div>
        
        <div className={`mt-3 flex gap-2 justify-end transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://etherscan.io/address/${wallet.address}`, '_blank');
            }}
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="sr-only">View on Etherscan</span>
          </Button>
          
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 hover:bg-destructive/10 hover:text-destructive"
            onClick={handleDisconnect}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="sr-only">Disconnect</span>
          </Button>
        </div>
      </div>
      
      {isActive && (
        <div className="absolute inset-0 border-2 border-primary pointer-events-none rounded-lg opacity-50"></div>
      )}
    </Card>
  );
};
