import { useState } from 'react';
import { Clock, ChevronRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { formatBalance } from '@/lib/dfinity';

export function MilestoneCard({ milestone, actor, onUpdate, onError }) {
  const [approving, setApproving] = useState(false);

  const getStatusColor = (status) => {
    const statusColors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'InProgress': 'bg-blue-100 text-blue-800',
      'Completed': 'bg-green-100 text-green-800',
      'Failed': 'bg-red-100 text-red-800',
      'Cancelled': 'bg-gray-100 text-gray-800'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleApprove = async () => {
    setApproving(true);
    try {
      const result = await actor.approveMilestone(milestone.id);
      if (result.ok) {
        onUpdate();
      } else {
        onError(result.err);
      }
    } catch (err) {
      onError('Failed to approve milestone');
    } finally {
      setApproving(false);
    }
  };

  const progressPercentage = (milestone.approvals.size() / milestone.requiredApprovalCount) * 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium">{milestone.description}</h3>
          <div className="flex items-center gap-4 mt-2">
            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(milestone.status)}`}>
              {milestone.status}
            </span>
            <span className="flex items-center text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(Number(milestone.deadline) / 1000000).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-medium">
            {formatBalance(milestone.fundingPool)} / {formatBalance(milestone.requiredAmount)}
          </div>
          <div className="text-sm text-gray-600">ckBTC</div>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Approval Progress</span>
          <span>{milestone.approvals.size()} / {milestone.requiredApprovalCount}</span>
        </div>
        <Progress value={progressPercentage} />
      </div>

      {milestone.status === 'Pending' && (
          <button
            onClick={handleApprove}
            disabled={approving}
            className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center
              ${approving ? 'bg-blue-400' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            {approving ? 'Approving...' : 'Approve Milestone'}
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>
    );
  }