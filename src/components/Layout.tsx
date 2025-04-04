
import React from 'react';
import { WalletConnectButton } from './wallet/WalletConnectButton';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-web3">
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-accent">
              Multi-Wallet DApp
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <WalletConnectButton />
          </div>
        </div>
      </header>
      
      <main>
        {children}
      </main>
      
      <footer className="border-t border-white/10 py-6 mt-20">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Built with the wagmi SDK from reown/appkit</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
