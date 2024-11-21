import { Coins, UserCircle } from 'lucide-react';
import { formatBalance } from '@/lib/dfinity';

export function Header({ isConnected, totalContributions, principal }) {
  return (
    <header className="p-6 bg-white rounded-lg shadow-md flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">Crowdfunding Platform</h1>
      <div className="flex items-center gap-6">
        {/* Connection Status */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        {/* Total Contributions */}
        <div className="flex items-center gap-2">
          <Coins className="w-5 h-5 text-blue-500" />
          <span className="font-semibold text-gray-800">
            {formatBalance(totalContributions)} ckBTC
          </span>
        </div>
        {/* User Principal ID */}
        {principal && (
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <UserCircle className="w-5 h-5 text-gray-400" />
            <span className="font-mono truncate max-w-xs sm:max-w-none">{principal}</span>
          </div>
        )}
      </div>
    </header>
  );
}
