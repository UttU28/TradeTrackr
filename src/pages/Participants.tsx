import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import Card, { CardHeader, CardContent } from '../components/ui/Card';
import UserList from '../components/users/UserList';
import UserForm from '../components/users/UserForm';

const Participants: React.FC = () => {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
  const handleFormComplete = () => {
    setShowAddForm(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Participants</h1>
          <p className="text-white/70">
            Manage participants and their profit-sharing ratios
          </p>
        </div>
        
        {!showAddForm && (
          <button 
            className="btn-primary flex items-center mt-4 md:mt-0"
            onClick={() => setShowAddForm(true)}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Participant
          </button>
        )}
      </div>
      
      {showAddForm ? (
        <div className="mb-8">
          <Card>
            <CardHeader 
              title="Add New Participant" 
              description="Add a new participant with their default sharing ratio"
            />
            <CardContent>
              <UserForm onComplete={handleFormComplete} />
            </CardContent>
          </Card>
        </div>
      ) : null}
      
      <UserList />
      
      <div className="mt-8 bg-tradeBg/50 rounded-lg p-5 border border-tradeLight/20">
        <h3 className="text-lg font-medium text-white mb-3">About Profit Sharing</h3>
        <div className="text-white/70 space-y-3">
          <p>
            Each participant has a default ratio that determines how profits and losses are
            distributed. For example, if there are two participants with ratios of 1 and 2:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Participant 1 will receive 1/3 (33.3%) of gains or losses</li>
            <li>Participant 2 will receive 2/3 (66.7%) of gains or losses</li>
          </ul>
          <p>
            You can also adjust ratios for specific weeks if needed from the weekly view.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Participants; 