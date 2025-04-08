import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAppStore } from '../../store';
import { UserFormData, User } from '../../types';

interface UserFormProps {
  user?: User;
  onComplete?: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onComplete }) => {
  const { addUser, updateUser } = useAppStore();
  
  const [name, setName] = useState<string>(user?.name || '');
  const [ratio, setRatio] = useState<string>(user?.defaultRatio.toString() || '1');
  
  const isEditing = !!user;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !ratio) return;
    
    const userData: UserFormData = {
      name: name.trim(),
      defaultRatio: parseFloat(ratio),
    };
    
    if (isEditing && user) {
      updateUser(user.id, userData);
    } else {
      addUser(userData);
    }
    
    // Reset form
    setName('');
    setRatio('1');
    
    if (onComplete) {
      onComplete();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">
          Participant Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
          placeholder="Participant name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="ratio" className="block text-sm font-medium text-white/80 mb-1">
          Default Ratio
        </label>
        <div className="flex items-center">
          <input
            id="ratio"
            type="number"
            min="0"
            step="0.1"
            value={ratio}
            onChange={(e) => setRatio(e.target.value)}
            className="w-full bg-tradeBg border border-tradeLight/30 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-tradeHighlight"
            placeholder="1"
            required
          />
        </div>
        <p className="text-xs text-white/60 mt-1">
          The proportion of gains/losses that will be allocated to this participant by default.
        </p>
      </div>
      
      <div className="pt-2">
        <button
          type="submit"
          className="btn-primary w-full flex items-center justify-center"
          disabled={!name || !ratio}
        >
          <UserPlus className="w-5 h-5 mr-2" />
          {isEditing ? 'Update Participant' : 'Add Participant'}
        </button>
      </div>
    </form>
  );
};

export default UserForm; 