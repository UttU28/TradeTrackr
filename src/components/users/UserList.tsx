import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store';
import Card, { CardHeader, CardContent } from '../ui/Card';
import UserForm from './UserForm';
import { User } from '../../types';

const UserList: React.FC = () => {
  const { users, removeUser } = useAppStore();
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  const handleEdit = (user: User) => {
    setEditingUser(user);
  };
  
  const handleRemove = (userId: string) => {
    if (window.confirm('Are you sure you want to remove this participant?')) {
      removeUser(userId);
    }
  };
  
  const handleFormComplete = () => {
    setEditingUser(null);
  };
  
  const sortedUsers = [...users].sort((a, b) => a.name.localeCompare(b.name));
  
  return (
    <div>
      {editingUser ? (
        <Card>
          <CardHeader 
            title="Edit Participant" 
            description="Update participant's details and ratio"
          />
          <CardContent>
            <UserForm 
              user={editingUser}
              onComplete={handleFormComplete}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedUsers.map((user) => (
              <UserCard 
                key={user.id} 
                user={user} 
                onEdit={handleEdit} 
                onRemove={handleRemove} 
              />
            ))}
          </div>
          
          {sortedUsers.length === 0 && (
            <div className="text-center p-8 border border-dashed border-tradeLight/20 rounded-lg">
              <p className="text-white/70">No participants added yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onRemove: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onRemove }) => {
  return (
    <div className="bg-tradeDark/80 rounded-lg border border-tradeLight/20 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-medium text-white">{user.name}</h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onEdit(user)}
              className="p-1.5 rounded-full text-white/60 hover:text-white hover:bg-tradeLight/20"
              aria-label="Edit participant"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRemove(user.id)}
              className="p-1.5 rounded-full text-white/60 hover:text-tradeError hover:bg-tradeError/10"
              aria-label="Remove participant"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-white/70">Default Ratio:</span>
          <span className="bg-tradeLight/20 px-2 py-0.5 rounded-full text-sm">
            {user.defaultRatio}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserList; 