import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ token, showToast, openConfirmModal }) => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // { id, username, type: 'password' | 'quota', currentQuota? }
  const [logs, setLogs] = useState('');
  const [stats, setStats] = useState(null);
  const [shares, setShares] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'logs') fetchLogs();
    if (activeTab === 'shares') fetchShares();
  }, [activeTab]);

  const formatBytes = (bytes) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const formatExpiration = (expiresAt) => {
    if (!expiresAt) return 'Never';
    const date = new Date(expiresAt);
    if (isNaN(date.getTime())) return 'Never';
    const isExpired = date.getTime() < Date.now();
    return (
      <span className={isExpired ? 'text-red-500 font-semibold' : 'text-gray-600'}>
        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        {isExpired && ' (Expired)'}
      </span>
    );
  };

  const handleCopyLink = (shareId) => {
    const link = `${window.location.origin}/s/${shareId}`;
    navigator.clipboard.writeText(link)
      .then(() => showToast('Share link copied to clipboard', 'success'))
      .catch(() => showToast('Failed to copy link', 'error'));
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

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const text = await res.text();
      setLogs(text);
    } catch (e) {
      showToast('Failed to fetch logs', 'error');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchShares = async () => {
    try {
      const res = await fetch('/api/admin/shares', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setShares(data.shares || []);
      }
    } catch (e) {
      showToast('Failed to fetch shares', 'error');
    }
  };

  const handleRevokeShare = async (shareId) => {
    openConfirmModal('Are you sure you want to revoke this public share link? This will make the URL invalid immediately.', async () => {
      try {
        const res = await fetch(`/api/shares/${shareId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          showToast('Share link revoked', 'success');
          fetchShares();
          fetchStats();
        } else {
          showToast('Failed to revoke share link', 'error');
        }
      } catch (e) {
        showToast('Error revoking share link', 'error');
      }
    });
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
        fetchStats();
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
        fetchStats();
      } else {
        showToast('Update failed', 'error');
      }
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleDeleteUser = async (userId) => {
    openConfirmModal('Delete this user and ALL their files? This cannot be undone.', async () => {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setUsers(users.filter(u => u.id !== userId));
          showToast('User deleted', 'success');
          fetchStats();
        } else {
          showToast('Failed to delete user', 'error');
        }
      } catch (e) {
        showToast(e.message, 'error');
      }
    });
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

  const handleScrubDatabase = async () => {
    openConfirmModal('This will remove database records for files that are missing from the disk. Continue?', async () => {
      try {
        const res = await fetch('/api/admin/scrub', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          showToast(`Scrub complete. Removed ${data.removedCount} orphaned entries.`, 'success');
          fetchUsers();
          fetchStats();
        } else {
          showToast('Failed to scrub database', 'error');
        }
      } catch (e) {
        showToast('Error scrubbing database', 'error');
      }
    });
  };

  const totalUsers = stats?.totalUsers ?? 0;
  const totalFiles = stats?.totalFiles ?? 0;
  const totalShares = stats?.totalShares ?? 0;
  const totalStorageUsed = stats?.totalStorageUsed ?? 0;
  const totalStorageQuota = stats?.totalStorageQuota ?? 0;
  const storagePercentage = totalStorageQuota > 0 ? (totalStorageUsed / totalStorageQuota) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <a 
            href="/api/docs" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex-1 md:flex-none bg-indigo-50 text-indigo-700 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium hover:bg-indigo-100 text-center transition-colors border border-indigo-100"
          >
            API Docs
          </a>
          <button onClick={handleScrubDatabase} className="flex-1 md:flex-none bg-yellow-50 text-yellow-700 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium hover:bg-yellow-100 text-center transition-colors border border-yellow-100">Scrub DB</button>
          <button onClick={downloadBackup} className="flex-1 md:flex-none bg-gray-50 text-gray-700 px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium hover:bg-gray-100 text-center transition-colors border border-gray-200">Download Backup</button>
          {activeTab === 'users' && (
            <button onClick={() => setShowCreateModal(true)} className="flex-1 md:flex-none bg-blue-600 text-white px-3 py-2 text-sm md:px-4 md:py-2 md:text-base rounded-lg font-medium hover:bg-blue-700 text-center transition-colors">Create User</button>
          )}
        </div>
      </div>

      {/* Overview Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block mb-1">Total Users</span>
            <span className="text-3xl font-extrabold text-gray-900">{totalUsers}</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50">
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
        </div>

        {/* Files Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block mb-1">Total Files</span>
            <span className="text-3xl font-extrabold text-gray-900">{totalFiles}</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Shares Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
          <div>
            <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block mb-1">Active Shares</span>
            <span className="text-3xl font-extrabold text-gray-900">{totalShares}</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-50">
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 10.742l4.632-2.316a3 3 0 111.414 2.828l-4.632 2.316a3 3 0 11-1.414-2.828zm5.632-1.484a1 1 0 100-2 1 1 0 000 2zm-5.632 4.976a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          </div>
        </div>

        {/* Storage Card */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wider block">Global Storage</span>
              <span className="text-lg font-bold text-gray-900 mt-1">
                {formatBytes(totalStorageUsed)} / {formatBytes(totalStorageQuota)}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-amber-50">
              <svg className="w-6 h-6 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(100, storagePercentage)}%` }}
            ></div>
          </div>
          <div className="text-right text-xs text-gray-500 mt-1">{storagePercentage.toFixed(1)}% Used</div>
        </div>
      </div>

      <div className="flex gap-6 mb-6 border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('users')} 
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'users' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Users
        </button>
        <button 
          onClick={() => setActiveTab('shares')} 
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'shares' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Public Share Links
        </button>
        <button 
          onClick={() => setActiveTab('logs')} 
          className={`pb-3 px-2 font-medium transition-colors ${activeTab === 'logs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          System Logs
        </button>
      </div>

      {activeTab === 'users' && (
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
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
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
                    <button onClick={() => setEditingUser({ ...user, type: 'quota', currentQuota: user.quota / (1024**3) })} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Quota</button>
                    <button onClick={() => setEditingUser({ ...user, type: 'password' })} className="text-blue-600 hover:text-blue-900 mr-4 font-semibold">Password</button>
                    {user.username !== 'admin' && (
                      <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 font-semibold">Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'shares' && (
        shares.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Active Share Links</h3>
            <p className="text-sm text-gray-500">Public file shares created by users will appear here for audit and revocation.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">File & Size</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Downloads</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Expiration</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Security</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shares.map(share => (
                    <tr key={share.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <a 
                            href={`/s/${share.id}`} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="font-medium text-blue-600 hover:text-blue-900 hover:underline text-sm truncate max-w-xs block"
                            title={share.fileName}
                          >
                            {share.fileName}
                          </a>
                          <span className="text-xs text-gray-400 mt-0.5">{formatBytes(share.fileSize)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {share.creatorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span className="font-semibold text-gray-800">{share.currentDownloads || 0}</span>
                        <span className="text-gray-400"> / </span>
                        <span>{share.maxDownloads ?? '∞'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatExpiration(share.expiresAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {share.isPasswordProtected ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            <svg className="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            Protected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800 border border-green-200">
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                            Public
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleCopyLink(share.id)} 
                          className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                        >
                          Copy Link
                        </button>
                        <button 
                          onClick={() => handleRevokeShare(share.id)} 
                          className="text-red-600 hover:text-red-900 font-semibold"
                        >
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
            <h3 className="font-medium text-gray-700">Server Logs</h3>
            <div className="flex gap-2">
              <button onClick={fetchLogs} className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1">Refresh</button>
              <button onClick={() => window.open(`/api/admin/logs?download=true&token=${token}`, '_blank')} className="text-sm bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-3 py-1 rounded">Download</button>
            </div>
          </div>
          <pre className="flex-1 p-4 overflow-auto text-xs font-mono bg-gray-900 text-gray-100 whitespace-pre-wrap">{logs || 'Loading logs...'}</pre>
        </div>
      )}

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
                        <button type="button" onClick={() => { setShowCreateModal(false); setEditingUser(null); }} className="px-4 py-2 text-gray-600 font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded font-semibold">Save</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;