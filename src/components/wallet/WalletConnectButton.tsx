
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';
import { useWallet } from '@/contexts/WalletContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { WalletConnectors } from './WalletConnectors';

export const WalletConnectButton: React.FC = () => {
  const { activeWallet, wallets } = useWallet();
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-muted border-muted-foreground/20 hover:bg-muted/80">
          <Wallet className="w-4 h-4 mr-2" />
          {activeWallet ? (
            <span className="font-mono">
              {activeWallet.address.substring(0, 6)}...
              {activeWallet.address.substring(activeWallet.address.length - 4)}
            </span>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{wallets.length > 0 ? 'Manage Wallets' : 'Connect a Wallet'}</DialogTitle>
          <DialogDescription>
            {wallets.length > 0
              ? 'Switch between connected wallets or connect a new one'
              : 'Connect with one of the available wallet providers below'}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <WalletConnectors closeModal={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
