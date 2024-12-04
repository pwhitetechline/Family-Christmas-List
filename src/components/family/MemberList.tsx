import React from 'react';

interface Member {
  id: string;
  user: {
    name: string;
    email: string;
  };
  role: string;
}

interface MemberListProps {
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
  onRemoveMember: (memberId: string) => void;
  onUpdateRole: (memberId: string, newRole: string) => void;
}

export default function MemberList({
  members,
  currentUserId,
  isAdmin,
  onRemoveMember,
  onUpdateRole,
}: MemberListProps) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900">Group Members</h3>
      <div className="mt-4 border-t border-gray-200">
        <ul role="list" className="divide-y divide-gray-200">
          {members.map((member) => (
            <li key={member.id} className="py-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{member.user.name}</p>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {isAdmin && member.id !== currentUserId && (
                  <>
                    <select
                      value={member.role}
                      onChange={(e) => onUpdateRole(member.id, e.target.value)}
                      className="rounded-md border-gray-300 text-sm focus:border-christmas-red focus:ring-christmas-red"
                    >
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                    <button
                      onClick={() => onRemoveMember(member.id)}
                      className="text-sm text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </>
                )}
                {!isAdmin && (
                  <span className="text-sm text-gray-500">
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
