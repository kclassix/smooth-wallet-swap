
import { useWallet } from "@/contexts/WalletContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { WalletCard } from "./wallet/WalletCard";
import { Button } from "./ui/button";
import { WalletConnectButton } from "./wallet/WalletConnectButton";

export const Dashboard = () => {
  const { wallets, activeWallet } = useWallet();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Multi-Wallet DApp
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Connect and switch between multiple wallets without disconnecting
        </p>
      </div>

      {!activeWallet ? (
        <Card className="mx-auto max-w-md bg-card/70 backdrop-blur">
          <CardHeader className="text-center">
            <CardTitle>Welcome to Multi-Wallet DApp</CardTitle>
            <CardDescription>
              Connect a wallet to get started with the application
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <WalletConnectButton />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Active Wallet Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30">
              <CardTitle className="flex items-center justify-between">
                <span>Active Wallet</span>
                <Badge className="bg-primary/20 text-primary">Connected</Badge>
              </CardTitle>
              <CardDescription>
                Your currently active wallet connection
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-muted-foreground mb-1">Address</div>
                  <div className="font-mono text-sm break-all">{activeWallet.address}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Connector</div>
                    <div>{activeWallet.connector}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">Network</div>
                    <div>
                      {activeWallet.chainId === 1 ? 'Ethereum Mainnet' : 
                       activeWallet.chainId === 11155111 ? 'Sepolia Testnet' : 
                       `Chain ID: ${activeWallet.chainId}`}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/30 px-6 py-4">
              <div className="flex justify-between w-full">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(`https://etherscan.io/address/${activeWallet.address}`, '_blank')}
                >
                  View on Etherscan
                </Button>
                <WalletConnectButton />
              </div>
            </CardFooter>
          </Card>

          {/* Connected Wallets Section */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>All Connected Wallets</CardTitle>
              <CardDescription>
                {wallets.length === 1 
                  ? "You have 1 wallet connected" 
                  : `You have ${wallets.length} wallets connected`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {wallets.map((wallet) => (
                  <WalletCard key={wallet.id} wallet={wallet} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
