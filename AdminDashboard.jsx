import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ token, showToast }) => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // { id, username, type: 'password' | 'quota', currentQuota? }

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatBytes = (bytes) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (e) {
      showToast('Failed to fetch users', 'error');
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.quota = data.quota * 1024 * 1024 * 1024; // GB to Bytes

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast('User created', 'success');
        setShowCreateModal(false);
        fetchUsers();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to create user', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const endpoint = editingUser.type === 'password' 
      ? `/api/users/${editingUser.id}/password`
      : `/api/users/${editingUser.id}/quota`;
    
    if (editingUser.type === 'quota') {
        data.quota = data.quota * 1024 * 1024 * 1024;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast('User updated', 'success');
        setEditingUser(null);
        fetchUsers();
      } else {
        showToast('Update failed', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user and ALL their files? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        showToast('User deleted', 'success');
      } else {
        showToast('Failed to delete user', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const downloadBackup = async () => {
    try {
        const res = await fetch('/api/admin/backup/db', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Backup failed');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cabinet-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (e) {
        showToast('Backup download failed', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={downloadBackup} className="flex-1 md:flex-none bg-gray-100 text-gray-700 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium hover:bg-gray-200 text-center">Download Backup</button>
          <button onClick={() => setShowCreateModal(true)} className="flex-1 md:flex-none bg-blue-600 text-white px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium hover:bg-blue-700 text-center">Create User</button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{user.username} {user.username === 'admin' && <span className="text-gray-400 font-normal">(System)</span>}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col w-48">
                    <span className="text-xs text-gray-500 mb-1">{formatBytes(user.usedSpace)} / {formatBytes(user.quota)}</span>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${Math.min(100, (user.usedSpace / user.quota) * 100)}%` }}></div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => setEditingUser({ ...user, type: 'quota', currentQuota: user.quota / (1024**3) })} className="text-blue-600 hover:text-blue-900 mr-4">Quota</button>
                  <button onClick={() => setEditingUser({ ...user, type: 'password' })} className="text-blue-600 hover:text-blue-900 mr-4">Password</button>
                  {user.username !== 'admin' && (
                    <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900">Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modals for Create/Edit would go here (simplified for brevity, using same pattern as App.jsx) */}
      {(showCreateModal || editingUser) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">{showCreateModal ? 'Create User' : `Edit ${editingUser.username}`}</h3>
                <form onSubmit={showCreateModal ? handleCreateUser : handleUpdateUser}>
                    {showCreateModal && <input name="username" placeholder="Username" className="w-full p-2 border rounded mb-3" required />}
                    {(showCreateModal || editingUser?.type === 'password') && <input name="password" type="password" placeholder="Password" className="w-full p-2 border rounded mb-3" required />}
                    {(showCreateModal || editingUser?.type === 'quota') && (
                        <div>
                            <label className="text-sm text-gray-600">Quota (GB)</label>
                            <input name="quota" type="number" defaultValue={editingUser?.currentQuota || 50} className="w-full p-2 border rounded mb-3" required />
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => { setShowCreateModal(false); setEditingUser(null); }} className="px-4 py-2 text-gray-600">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;