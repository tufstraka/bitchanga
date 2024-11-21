import { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ContributionForm({ actor, onSuccess, onError }) {
  const [contribution, setContribution] = useState({
    amount: '',
    btcAddress: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      const result = await actor.contribute(
        Number(contribution.amount),
        contribution.btcAddress ? [contribution.btcAddress] : []
      );

      if (result.ok) {
        setSuccess(true);
        setContribution({ amount: '', btcAddress: '' });
        onSuccess();
      } else {
        onError(result.err);
      }
    } catch (err) {
      onError('Failed to process contribution');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Make a Contribution</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount (ckBTC)
          </label>
          <input
            type="number"
            value={contribution.amount}
            onChange={(e) => setContribution(prev => ({ ...prev, amount: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            required
            min="0"
            step="0.00000001"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bitcoin Address (Optional)
          </label>
          <input
            type="text"
            value={contribution.btcAddress}
            onChange={(e) => setContribution(prev => ({ ...prev, btcAddress: e.target.value }))}
            className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your BTC address"
          />
        </div>
        {success && (
          <Alert className="bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-500" />
            <AlertDescription>Contribution successful!</AlertDescription>
          </Alert>
        )}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium 
            ${submitting ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {submitting ? 'Processing...' : 'Contribute'}
        </button>
      </form>
    </div>
  );
}
