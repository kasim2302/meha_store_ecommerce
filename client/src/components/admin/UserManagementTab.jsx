import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, ShieldCheck, User } from 'lucide-react';

const UserManagementTab = ({ userToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userToken]);

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Registered Users</h2>
          <p className="text-sm text-gray-500">{users.length} total users</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-sm font-medium text-gray-500">User</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Email</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Role</th>
                <th className="py-3 px-4 text-sm font-medium text-gray-500">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {u.profilePicture ? (
                        <img src={u.profilePicture} alt={u.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-100" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                      <span className="font-medium text-gray-900 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{u.email}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      u.role === 'admin'
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {u.role === 'admin' && <ShieldCheck className="h-3 w-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;
