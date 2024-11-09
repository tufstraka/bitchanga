import { Coins } from 'lucide-react';
import { formatBalance } from '@/lib/dfinity';

export function Header({ isConnected, totalContributions }) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Crowdfunding Platform</h1>
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm text-gray-600">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-blue-500" />
          <span className="font-medium">
            {formatBalance(totalContributions)} ckBTC
          </span>
        </div>
      </div>
    </div>
  );
}