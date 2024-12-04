import React, { useState } from 'react';

interface MemberInviteFormProps {
  groupId: string;
  onInvite?: () => void;
}

export default function MemberInviteForm({ groupId, onInvite }: MemberInviteFormProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/family-groups/${groupId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        setEmail('');
        onInvite?.();
      } else {
        throw new Error('Failed to invite member');
      }
    } catch (error) {
      console.error('Member invite error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Invite Member by Email
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 rounded-l-md border-gray-300 focus:border-christmas-red focus:ring-christmas-red"
            placeholder="family.member@example.com"
            required
          />
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-christmas-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-christmas-green"
          >
            Invite
          </button>
        </div>
      </div>
    </form>
  );
}
