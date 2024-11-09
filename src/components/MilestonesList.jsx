import { MilestoneCard } from './MilestoneCard';

export function MilestonesList({ milestones, actor, onUpdate, onError }) {
  if (!milestones.length) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">No milestones have been created yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Project Milestones</h2>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <MilestoneCard 
            key={index}
            milestone={milestone}
            actor={actor}
            onUpdate={onUpdate}
            onError={onError}
          />
        ))}
      </div>
    </div>
  );
}